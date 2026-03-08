using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartHire.Application.Common.Interfaces;
using SmartHire.Application.Jobs.DTOs;
using SmartHire.Domain.Enums;
namespace SmartHire.Application.Jobs.Commands;
public record UpdateJobCommand(
    Guid Id, string Title, string Description, string Department, string Location,
    string? SalaryRange, string Status, DateTime? Deadline) : IRequest<JobDto>;

public class UpdateJobCommandHandler : IRequestHandler<UpdateJobCommand, JobDto>
{
    private readonly IAppDbContext _context;
    public UpdateJobCommandHandler(IAppDbContext context) => _context = context;
    public async Task<JobDto> Handle(UpdateJobCommand request, CancellationToken cancellationToken)
    {
        var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException("Job not found.");
        job.Title = request.Title;
        job.Description = request.Description;
        job.Department = request.Department;
        job.Location = request.Location;
        job.SalaryRange = request.SalaryRange;
        job.Deadline = request.Deadline;
        job.Status = Enum.TryParse<JobStatus>(request.Status, true, out var s) ? s : job.Status;
        job.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == job.PostedByUserId, cancellationToken);
        return new JobDto
        {
            Id = job.Id, Title = job.Title, Description = job.Description,
            Department = job.Department, Location = job.Location, SalaryRange = job.SalaryRange,
            Status = job.Status.ToString(), Deadline = job.Deadline,
            PostedByName = user != null ? $"{user.FirstName} {user.LastName}" : "",
            CreatedAt = job.CreatedAt,
            ApplicationCount = _context.Applications.Count(a => a.JobId == job.Id)
        };
    }
}
