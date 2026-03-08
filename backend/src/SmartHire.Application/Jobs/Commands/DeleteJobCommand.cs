using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartHire.Application.Common.Interfaces;
namespace SmartHire.Application.Jobs.Commands;
public record DeleteJobCommand(Guid Id) : IRequest;

public class DeleteJobCommandHandler : IRequestHandler<DeleteJobCommand>
{
    private readonly IAppDbContext _context;
    public DeleteJobCommandHandler(IAppDbContext context) => _context = context;
    public async Task Handle(DeleteJobCommand request, CancellationToken cancellationToken)
    {
        var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException("Job not found.");
        _context.Jobs.Remove(job);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
