using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartHire.Application.Common.Interfaces;
using SmartHire.Application.Common.Models;
using SmartHire.Domain.Entities;
using SmartHire.Domain.Enums;
namespace SmartHire.Application.Auth.Commands;
public record RegisterCommand(
    string FirstName, string LastName, string Email, string Password, string Role) : IRequest<AuthResult>;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResult>
{
    private readonly IAppDbContext _context;
    private readonly ITokenService _tokenService;
    public RegisterCommandHandler(IAppDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }
    public async Task<AuthResult> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email, cancellationToken))
            throw new InvalidOperationException("Email already registered.");
        var role = Enum.TryParse<UserRole>(request.Role, true, out var parsed) ? parsed : UserRole.Candidate;
        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = role
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);
        return new AuthResult
        {
            Token = _tokenService.GenerateToken(user),
            Email = user.Email,
            FullName = $"{user.FirstName} {user.LastName}",
            Role = user.Role.ToString(),
            UserId = user.Id
        };
    }
}
