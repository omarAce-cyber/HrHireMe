using MediatR;
using Microsoft.EntityFrameworkCore;
using SmartHire.Application.Assessments.DTOs;
using SmartHire.Application.Common.Interfaces;
namespace SmartHire.Application.Assessments.Queries;
public record GetAssessmentQuery(Guid Id, bool IncludeAnswers = false) : IRequest<AssessmentWithQuestionsDto?>;

public class GetAssessmentQueryHandler : IRequestHandler<GetAssessmentQuery, AssessmentWithQuestionsDto?>
{
    private readonly IAppDbContext _context;
    public GetAssessmentQueryHandler(IAppDbContext context) => _context = context;
    public async Task<AssessmentWithQuestionsDto?> Handle(GetAssessmentQuery request, CancellationToken cancellationToken)
    {
        var a = await _context.Assessments.Include(a => a.Job).Include(a => a.Questions)
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);
        if (a == null) return null;
        var questions = a.IsRandomized ? a.Questions.OrderBy(_ => Guid.NewGuid()).ToList() : a.Questions.ToList();
        return new AssessmentWithQuestionsDto
        {
            Id = a.Id, Title = a.Title, Description = a.Description,
            TimeLimitMinutes = a.TimeLimitMinutes, IsRandomized = a.IsRandomized,
            JobId = a.JobId, JobTitle = a.Job.Title, QuestionCount = a.Questions.Count,
            CreatedAt = a.CreatedAt,
            Questions = questions.Select(q => new QuestionDto
            {
                Id = q.Id, Text = q.Text, OptionA = q.OptionA, OptionB = q.OptionB,
                OptionC = q.OptionC, OptionD = q.OptionD, Points = q.Points,
                CorrectAnswer = request.IncludeAnswers ? q.CorrectAnswer : null
            }).ToList()
        };
    }
}
