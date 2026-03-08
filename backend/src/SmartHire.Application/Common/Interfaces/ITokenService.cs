using SmartHire.Domain.Entities;
namespace SmartHire.Application.Common.Interfaces;
public interface ITokenService
{
    string GenerateToken(User user);
}
