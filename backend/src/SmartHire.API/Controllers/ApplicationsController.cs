using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartHire.Application.Applications.Commands;
using SmartHire.Application.Applications.Queries;
namespace SmartHire.API.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly IMediator _mediator;
    public ApplicationsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetApplications([FromQuery] Guid? jobId, [FromQuery] Guid? candidateId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        => Ok(await _mediator.Send(new GetApplicationsQuery(jobId, candidateId, page, pageSize)));

    [HttpPost]
    [Authorize(Roles = "Candidate")]
    public async Task<IActionResult> Apply([FromBody] ApplyJobCommand command)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        try { return Ok(await _mediator.Send(command with { CandidateId = userId })); }
        catch (InvalidOperationException ex) { return Conflict(new { error = ex.Message }); }
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "HR,Admin")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateApplicationStatusCommand command)
    {
        try { return Ok(await _mediator.Send(command with { Id = id })); }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
    }
}
