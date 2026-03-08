using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartHire.Application.Common.Interfaces;
using SmartHire.Application.Results.DTOs;
using SmartHire.Domain.Entities;
using System.Text.Json;
namespace SmartHire.Application.Results.Commands;
public record AnswerSubmission(Guid QuestionId, char Answer);
public record SubmitResultCommand(Guid AssessmentId, Guid CandidateId, List<AnswerSubmission> Answers, int TimeTakenSeconds, int FocusLostCount) : IRequest<ResultDto>;

public class SubmitResultCommandHandler : IRequestHandler<SubmitResultCommand, ResultDto>
{
    private readonly IAppDbContext _context;
    public SubmitResultCommandHandler(IAppDbContext context) => _context = context;
    public async Task<ResultDto> Handle(SubmitResultCommand request, CancellationToken cancellationToken)
    {
        var assessment = await _context.Assessments.Include(a => a.Questions)
            .FirstOrDefaultAsync(a => a.Id == request.AssessmentId, cancellationToken)
            ?? throw new KeyNotFoundException("Assessment not found.");
        double score = 0;
        double maxScore = assessment.Questions.Sum(q => q.Points);
        foreach (var ans in request.Answers)
        {
            var q = assessment.Questions.FirstOrDefault(q => q.Id == ans.QuestionId);
            if (q != null && q.CorrectAnswer == char.ToUpper(ans.Answer)) score += q.Points;
        }
        var result = new AssessmentResult
        {
            AssessmentId = request.AssessmentId, CandidateId = request.CandidateId,
            Score = score, MaxScore = maxScore,
            TimeTakenSeconds = request.TimeTakenSeconds,
            FocusLostCount = request.FocusLostCount,
            CompletedWithCheatingFlag = request.FocusLostCount > 3,
            AnswersJson = JsonSerializer.Serialize(request.Answers)
        };
        _context.Results.Add(result);
        var application = await _context.Applications.FirstOrDefaultAsync(a => a.JobId == assessment.JobId && a.CandidateId == request.CandidateId, cancellationToken);
        if (application != null && maxScore > 0)
            application.ReadinessScore = Math.Round(score / maxScore * 100, 1);
        await _context.SaveChangesAsync(cancellationToken);
        var candidate = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.CandidateId, cancellationToken);
        return new ResultDto
        {
            Id = result.Id, AssessmentId = result.AssessmentId, AssessmentTitle = assessment.Title,
            CandidateId = result.CandidateId,
            CandidateName = candidate != null ? $"{candidate.FirstName} {candidate.LastName}" : "",
            Score = result.Score, MaxScore = result.MaxScore,
            TimeTakenSeconds = result.TimeTakenSeconds,
            CompletedWithCheatingFlag = result.CompletedWithCheatingFlag,
            FocusLostCount = result.FocusLostCount, CreatedAt = result.CreatedAt
        };
    }
}
