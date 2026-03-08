using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartHire.Application.Common.Interfaces;
using SmartHire.Application.Jobs.DTOs;
using SmartHire.Domain.Entities;
using SmartHire.Domain.Enums;
namespace SmartHire.Application.Jobs.Commands;
public record CreateJobCommand(
    string Title, string Description, string Department, string Location,
    string? SalaryRange, DateTime? Deadline, Guid PostedByUserId) : IRequest<JobDto>;

public class CreateJobCommandHandler : IRequestHandler<CreateJobCommand, JobDto>
{
    private readonly IAppDbContext _context;
    public CreateJobCommandHandler(IAppDbContext context) => _context = context;
    public async Task<JobDto> Handle(CreateJobCommand request, CancellationToken cancellationToken)
    {
        var job = new Job
        {
            Title = request.Title,
            Description = request.Description,
            Department = request.Department,
            Location = request.Location,
            SalaryRange = request.SalaryRange,
            Deadline = request.Deadline,
            PostedByUserId = request.PostedByUserId,
            Status = JobStatus.Open
        };
        _context.Jobs.Add(job);
        await _context.SaveChangesAsync(cancellationToken);
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.PostedByUserId, cancellationToken);
        return new JobDto
        {
            Id = job.Id, Title = job.Title, Description = job.Description,
            Department = job.Department, Location = job.Location, SalaryRange = job.SalaryRange,
            Status = job.Status.ToString(), Deadline = job.Deadline,
            PostedByName = user != null ? $"{user.FirstName} {user.LastName}" : "",
            CreatedAt = job.CreatedAt
        };
    }
}
