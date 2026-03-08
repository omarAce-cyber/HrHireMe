namespace SmartHire.Application.Assessments.DTOs;
public class AssessmentDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int TimeLimitMinutes { get; set; }
    public bool IsRandomized { get; set; }
    public Guid JobId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public int QuestionCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class QuestionDto
{
    public Guid Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public string OptionA { get; set; } = string.Empty;
    public string OptionB { get; set; } = string.Empty;
    public string OptionC { get; set; } = string.Empty;
    public string OptionD { get; set; } = string.Empty;
    public int Points { get; set; }
    public char? CorrectAnswer { get; set; }
}

public class AssessmentWithQuestionsDto : AssessmentDto
{
    public List<QuestionDto> Questions { get; set; } = new();
}
