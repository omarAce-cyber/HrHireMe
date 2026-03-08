using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartHire.Application.Applications.DTOs;
using SmartHire.Application.Common.Interfaces;
using SmartHire.Domain.Entities;
namespace SmartHire.Application.Applications.Commands;
public record ApplyJobCommand(Guid JobId, Guid CandidateId, string? CoverLetter) : IRequest<ApplicationDto>;

public class ApplyJobCommandHandler : IRequestHandler<ApplyJobCommand, ApplicationDto>
{
    private readonly IAppDbContext _context;
    public ApplyJobCommandHandler(IAppDbContext context) => _context = context;
    public async Task<ApplicationDto> Handle(ApplyJobCommand request, CancellationToken cancellationToken)
    {
        if (await _context.Applications.AnyAsync(a => a.JobId == request.JobId && a.CandidateId == request.CandidateId, cancellationToken))
            throw new InvalidOperationException("Already applied to this job.");
        var application = new JobApplication
        {
            JobId = request.JobId, CandidateId = request.CandidateId, CoverLetter = request.CoverLetter
        };
        _context.Applications.Add(application);
        await _context.SaveChangesAsync(cancellationToken);
        var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == request.JobId, cancellationToken);
        var candidate = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.CandidateId, cancellationToken);
        return new ApplicationDto
        {
            Id = application.Id, JobId = request.JobId,
            JobTitle = job?.Title ?? "", CandidateId = request.CandidateId,
            CandidateName = candidate != null ? $"{candidate.FirstName} {candidate.LastName}" : "",
            CandidateEmail = candidate?.Email ?? "",
            Status = application.Status.ToString(), CoverLetter = request.CoverLetter,
            CreatedAt = application.CreatedAt
        };
    }
}
