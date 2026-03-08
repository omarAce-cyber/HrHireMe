using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartHire.Application.Assessments.DTOs;
using SmartHire.Application.Common.Interfaces;
using SmartHire.Domain.Entities;
namespace SmartHire.Application.Assessments.Commands;
public record CreateQuestionRequest(string Text, string OptionA, string OptionB, string OptionC, string OptionD, char CorrectAnswer, int Points = 1);
public record CreateAssessmentCommand(string Title, string? Description, int TimeLimitMinutes, bool IsRandomized, Guid JobId, List<CreateQuestionRequest> Questions) : IRequest<AssessmentDto>;

public class CreateAssessmentCommandHandler : IRequestHandler<CreateAssessmentCommand, AssessmentDto>
{
    private readonly IAppDbContext _context;
    public CreateAssessmentCommandHandler(IAppDbContext context) => _context = context;
    public async Task<AssessmentDto> Handle(CreateAssessmentCommand request, CancellationToken cancellationToken)
    {
        var assessment = new Assessment
        {
            Title = request.Title, Description = request.Description,
            TimeLimitMinutes = request.TimeLimitMinutes, IsRandomized = request.IsRandomized,
            JobId = request.JobId
        };
        foreach (var q in request.Questions)
            assessment.Questions.Add(new Question
            {
                Text = q.Text, OptionA = q.OptionA, OptionB = q.OptionB,
                OptionC = q.OptionC, OptionD = q.OptionD, CorrectAnswer = q.CorrectAnswer, Points = q.Points
            });
        _context.Assessments.Add(assessment);
        await _context.SaveChangesAsync(cancellationToken);
        var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == request.JobId, cancellationToken);
        return new AssessmentDto
        {
            Id = assessment.Id, Title = assessment.Title, Description = assessment.Description,
            TimeLimitMinutes = assessment.TimeLimitMinutes, IsRandomized = assessment.IsRandomized,
            JobId = assessment.JobId, JobTitle = job?.Title ?? "",
            QuestionCount = assessment.Questions.Count, CreatedAt = assessment.CreatedAt
        };
    }
}
