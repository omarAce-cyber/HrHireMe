using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartHire.Application.Analytics.Queries;
namespace SmartHire.API.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "HR,Admin")]
public class AnalyticsController : ControllerBase
{
    private readonly IMediator _mediator;
    public AnalyticsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAnalytics()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var isAdmin = User.IsInRole("Admin");
        return Ok(await _mediator.Send(new GetAnalyticsQuery(isAdmin ? null : userId)));
    }
}
