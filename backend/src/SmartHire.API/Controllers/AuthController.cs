using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartHire.Application.Auth.Commands;
namespace SmartHire.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    public AuthController(IMediator mediator) => _mediator = mediator;

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command)
    {
        try { return Ok(await _mediator.Send(command)); }
        catch (InvalidOperationException ex) { return Conflict(new { error = ex.Message }); }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        try { return Ok(await _mediator.Send(command)); }
        catch (UnauthorizedAccessException ex) { return Unauthorized(new { error = ex.Message }); }
    }
}
