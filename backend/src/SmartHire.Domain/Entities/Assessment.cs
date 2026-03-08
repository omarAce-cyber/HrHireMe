using SmartHire.Domain.Common;
namespace SmartHire.Domain.Entities;
public class Assessment : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int TimeLimitMinutes { get; set; } = 30;
    public bool IsRandomized { get; set; } = true;
    public Guid JobId { get; set; }
    public Job Job { get; set; } = null!;
    public ICollection<Question> Questions { get; set; } = new List<Question>();
    public ICollection<AssessmentResult> Results { get; set; } = new List<AssessmentResult>();
}
