using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartHire.Application.Applications.DTOs;
using SmartHire.Application.Common.Interfaces;
using SmartHire.Application.Common.Models;
namespace SmartHire.Application.Applications.Queries;
public record GetApplicationsQuery(Guid? JobId, Guid? CandidateId, int Page = 1, int PageSize = 10) : IRequest<PagedResult<ApplicationDto>>;

public class GetApplicationsQueryHandler : IRequestHandler<GetApplicationsQuery, PagedResult<ApplicationDto>>
{
    private readonly IAppDbContext _context;
    public GetApplicationsQueryHandler(IAppDbContext context) => _context = context;
    public async Task<PagedResult<ApplicationDto>> Handle(GetApplicationsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Applications.Include(a => a.Job).Include(a => a.Candidate).AsQueryable();
        if (request.JobId.HasValue) query = query.Where(a => a.JobId == request.JobId.Value);
        if (request.CandidateId.HasValue) query = query.Where(a => a.CandidateId == request.CandidateId.Value);
        var total = await query.CountAsync(cancellationToken);
        var items = await query.OrderByDescending(a => a.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize).Take(request.PageSize)
            .Select(a => new ApplicationDto
            {
                Id = a.Id, JobId = a.JobId, JobTitle = a.Job.Title,
                CandidateId = a.CandidateId,
                CandidateName = $"{a.Candidate.FirstName} {a.Candidate.LastName}",
                CandidateEmail = a.Candidate.Email,
                Status = a.Status.ToString(), CoverLetter = a.CoverLetter,
                ReadinessScore = a.ReadinessScore, CreatedAt = a.CreatedAt
            }).ToListAsync(cancellationToken);
        return new PagedResult<ApplicationDto> { Items = items, TotalCount = total, Page = request.Page, PageSize = request.PageSize };
    }
}
