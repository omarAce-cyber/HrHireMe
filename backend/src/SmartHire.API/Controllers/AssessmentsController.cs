using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartHire.Application.Assessments.Commands;
using SmartHire.Application.Assessments.Queries;
using SmartHire.Application.Results.Commands;
namespace SmartHire.API.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssessmentsController : ControllerBase
{
    private readonly IMediator _mediator;
    public AssessmentsController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAssessment(Guid id)
    {
        var isHrOrAdmin = User.IsInRole("HR") || User.IsInRole("Admin");
        var result = await _mediator.Send(new GetAssessmentQuery(id, isHrOrAdmin));
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "HR,Admin")]
    public async Task<IActionResult> CreateAssessment([FromBody] CreateAssessmentCommand command)
        => Ok(await _mediator.Send(command));

    [HttpPost("{id}/submit")]
    [Authorize(Roles = "Candidate")]
    public async Task<IActionResult> SubmitResult(Guid id, [FromBody] SubmitResultCommand command)
    {
        try { return Ok(await _mediator.Send(command with { AssessmentId = id })); }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
    }
}
