using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartHire.Application.Common.Interfaces;
using SmartHire.Application.Jobs.DTOs;
namespace SmartHire.Application.Jobs.Queries;
public record GetJobByIdQuery(Guid Id) : IRequest<JobDto?>;

public class GetJobByIdQueryHandler : IRequestHandler<GetJobByIdQuery, JobDto?>
{
    private readonly IAppDbContext _context;
    public GetJobByIdQueryHandler(IAppDbContext context) => _context = context;
    public async Task<JobDto?> Handle(GetJobByIdQuery request, CancellationToken cancellationToken)
    {
        var j = await _context.Jobs.Include(j => j.PostedBy).Include(j => j.Applications)
            .FirstOrDefaultAsync(j => j.Id == request.Id, cancellationToken);
        if (j == null) return null;
        return new JobDto
        {
            Id = j.Id, Title = j.Title, Description = j.Description,
            Department = j.Department, Location = j.Location, SalaryRange = j.SalaryRange,
            Status = j.Status.ToString(), Deadline = j.Deadline,
            PostedByName = $"{j.PostedBy.FirstName} {j.PostedBy.LastName}",
            CreatedAt = j.CreatedAt, ApplicationCount = j.Applications.Count
        };
    }
}
