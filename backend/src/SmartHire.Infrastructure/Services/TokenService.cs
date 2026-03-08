using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SmartHire.Application.Common.Interfaces;
using SmartHire.Domain.Entities;
namespace SmartHire.Infrastructure.Services;
public class TokenService : ITokenService
{
    private readonly IConfiguration _config;
    public TokenService(IConfiguration config) => _config = config;
    public string GenerateToken(User user)
    {
        var keyString = _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT key is not configured.");
        if (keyString.Length < 32)
            throw new InvalidOperationException("JWT key must be at least 32 characters (256 bits).");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}")
        };
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
