using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartHire.Application.Jobs.Commands;
using SmartHire.Application.Jobs.Queries;
namespace SmartHire.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class JobsController : ControllerBase
{
    private readonly IMediator _mediator;
    public JobsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetJobs([FromQuery] string? search, [FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        => Ok(await _mediator.Send(new GetJobsQuery(search, status, page, pageSize)));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetJob(Guid id)
    {
        var job = await _mediator.Send(new GetJobByIdQuery(id));
        return job == null ? NotFound() : Ok(job);
    }

    [HttpPost]
    [Authorize(Roles = "HR,Admin")]
    public async Task<IActionResult> CreateJob([FromBody] CreateJobCommand command)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var cmd = command with { PostedByUserId = userId };
        var result = await _mediator.Send(cmd);
        return CreatedAtAction(nameof(GetJob), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "HR,Admin")]
    public async Task<IActionResult> UpdateJob(Guid id, [FromBody] UpdateJobCommand command)
    {
        try { return Ok(await _mediator.Send(command with { Id = id })); }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "HR,Admin")]
    public async Task<IActionResult> DeleteJob(Guid id)
    {
        try { await _mediator.Send(new DeleteJobCommand(id)); return NoContent(); }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
    }
}
