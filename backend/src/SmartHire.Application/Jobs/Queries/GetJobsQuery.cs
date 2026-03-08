using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartHire.Application.Common.Interfaces;
using SmartHire.Application.Common.Models;
using SmartHire.Application.Jobs.DTOs;
namespace SmartHire.Application.Jobs.Queries;
public record GetJobsQuery(string? Search, string? Status, int Page = 1, int PageSize = 10) : IRequest<PagedResult<JobDto>>;

public class GetJobsQueryHandler : IRequestHandler<GetJobsQuery, PagedResult<JobDto>>
{
    private readonly IAppDbContext _context;
    public GetJobsQueryHandler(IAppDbContext context) => _context = context;
    public async Task<PagedResult<JobDto>> Handle(GetJobsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Jobs.Include(j => j.PostedBy).Include(j => j.Applications).AsQueryable();
        if (!string.IsNullOrEmpty(request.Search))
            query = query.Where(j => j.Title.Contains(request.Search) || j.Department.Contains(request.Search) || j.Location.Contains(request.Search));
        if (!string.IsNullOrEmpty(request.Status))
            query = query.Where(j => j.Status.ToString() == request.Status);
        var total = await query.CountAsync(cancellationToken);
        var items = await query.OrderByDescending(j => j.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize).Take(request.PageSize)
            .Select(j => new JobDto
            {
                Id = j.Id, Title = j.Title, Description = j.Description,
                Department = j.Department, Location = j.Location, SalaryRange = j.SalaryRange,
                Status = j.Status.ToString(), Deadline = j.Deadline,
                PostedByName = $"{j.PostedBy.FirstName} {j.PostedBy.LastName}",
                CreatedAt = j.CreatedAt, ApplicationCount = j.Applications.Count
            }).ToListAsync(cancellationToken);
        return new PagedResult<JobDto> { Items = items, TotalCount = total, Page = request.Page, PageSize = request.PageSize };
    }
}
