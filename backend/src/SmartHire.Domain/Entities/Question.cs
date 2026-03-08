using SmartHire.Domain.Common;
namespace SmartHire.Domain.Entities;
public class Question : BaseEntity
{
    public string Text { get; set; } = string.Empty;
    public string OptionA { get; set; } = string.Empty;
    public string OptionB { get; set; } = string.Empty;
    public string OptionC { get; set; } = string.Empty;
    public string OptionD { get; set; } = string.Empty;
    public char CorrectAnswer { get; set; }
    public int Points { get; set; } = 1;
    public Guid AssessmentId { get; set; }
    public Assessment Assessment { get; set; } = null!;
}
