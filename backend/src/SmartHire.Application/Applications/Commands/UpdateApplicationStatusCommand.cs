using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartHire.Application.Applications.DTOs;
using SmartHire.Application.Common.Interfaces;
using SmartHire.Domain.Enums;
namespace SmartHire.Application.Applications.Commands;
public record UpdateApplicationStatusCommand(Guid Id, string Status) : IRequest<ApplicationDto>;

public class UpdateApplicationStatusCommandHandler : IRequestHandler<UpdateApplicationStatusCommand, ApplicationDto>
{
    private readonly IAppDbContext _context;
    public UpdateApplicationStatusCommandHandler(IAppDbContext context) => _context = context;
    public async Task<ApplicationDto> Handle(UpdateApplicationStatusCommand request, CancellationToken cancellationToken)
    {
        var application = await _context.Applications.FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException("Application not found.");
        application.Status = Enum.TryParse<ApplicationStatus>(request.Status, true, out var s) ? s : application.Status;
        application.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == application.JobId, cancellationToken);
        var candidate = await _context.Users.FirstOrDefaultAsync(u => u.Id == application.CandidateId, cancellationToken);
        return new ApplicationDto
        {
            Id = application.Id, JobId = application.JobId, JobTitle = job?.Title ?? "",
            CandidateId = application.CandidateId,
            CandidateName = candidate != null ? $"{candidate.FirstName} {candidate.LastName}" : "",
            CandidateEmail = candidate?.Email ?? "",
            Status = application.Status.ToString(), CoverLetter = application.CoverLetter,
            ReadinessScore = application.ReadinessScore, CreatedAt = application.CreatedAt
        };
    }
}
