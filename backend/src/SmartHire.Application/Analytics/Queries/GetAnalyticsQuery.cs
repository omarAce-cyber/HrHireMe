using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartHire.Application.Common.Interfaces;
namespace SmartHire.Application.Analytics.Queries;
public record GetAnalyticsQuery(Guid? HrUserId) : IRequest<AnalyticsDto>;

public class AnalyticsDto
{
    public int TotalJobs { get; set; }
    public int TotalApplications { get; set; }
    public int TotalCandidates { get; set; }
    public int TotalAssessments { get; set; }
    public double AverageScore { get; set; }
    public List<JobApplicationStat> ApplicationsPerJob { get; set; } = new();
    public List<ScoreDistribution> ScoreDistribution { get; set; } = new();
}
public record JobApplicationStat(string JobTitle, int Count);
public record ScoreDistribution(string Range, int Count);

public class GetAnalyticsQueryHandler : IRequestHandler<GetAnalyticsQuery, AnalyticsDto>
{
    private readonly IAppDbContext _context;
    public GetAnalyticsQueryHandler(IAppDbContext context) => _context = context;
    public async Task<AnalyticsDto> Handle(GetAnalyticsQuery request, CancellationToken cancellationToken)
    {
        var jobsQuery = _context.Jobs.AsQueryable();
        if (request.HrUserId.HasValue) jobsQuery = jobsQuery.Where(j => j.PostedByUserId == request.HrUserId.Value);
        var jobIds = await jobsQuery.Select(j => j.Id).ToListAsync(cancellationToken);
        var totalApps = await _context.Applications.CountAsync(a => jobIds.Contains(a.JobId), cancellationToken);
        var totalCandidates = await _context.Users.CountAsync(u => u.Role == Domain.Enums.UserRole.Candidate, cancellationToken);
        var results = await _context.Results.Where(r => _context.Assessments.Any(a => a.Id == r.AssessmentId && jobIds.Contains(a.JobId))).ToListAsync(cancellationToken);
        var avgScore = results.Any() ? Math.Round(results.Average(r => r.MaxScore > 0 ? r.Score / r.MaxScore * 100 : 0), 1) : 0;
        var appsPerJob = await _context.Applications.Include(a => a.Job)
            .Where(a => jobIds.Contains(a.JobId))
            .GroupBy(a => a.Job.Title)
            .Select(g => new JobApplicationStat(g.Key, g.Count()))
            .ToListAsync(cancellationToken);
        var scoreDist = new List<ScoreDistribution>
        {
            new("0-20%", results.Count(r => r.MaxScore > 0 && r.Score/r.MaxScore*100 < 20)),
            new("20-40%", results.Count(r => r.MaxScore > 0 && r.Score/r.MaxScore*100 >= 20 && r.Score/r.MaxScore*100 < 40)),
            new("40-60%", results.Count(r => r.MaxScore > 0 && r.Score/r.MaxScore*100 >= 40 && r.Score/r.MaxScore*100 < 60)),
            new("60-80%", results.Count(r => r.MaxScore > 0 && r.Score/r.MaxScore*100 >= 60 && r.Score/r.MaxScore*100 < 80)),
            new("80-100%", results.Count(r => r.MaxScore > 0 && r.Score/r.MaxScore*100 >= 80))
        };
        return new AnalyticsDto
        {
            TotalJobs = jobIds.Count, TotalApplications = totalApps,
            TotalCandidates = totalCandidates,
            TotalAssessments = await _context.Assessments.CountAsync(a => jobIds.Contains(a.JobId), cancellationToken),
            AverageScore = avgScore, ApplicationsPerJob = appsPerJob, ScoreDistribution = scoreDist
        };
    }
}
