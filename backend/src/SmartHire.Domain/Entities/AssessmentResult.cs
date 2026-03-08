using SmartHire.Domain.Common;
namespace SmartHire.Domain.Entities;
public class AssessmentResult : BaseEntity
{
    public Guid AssessmentId { get; set; }
    public Assessment Assessment { get; set; } = null!;
    public Guid CandidateId { get; set; }
    public User Candidate { get; set; } = null!;
    public double Score { get; set; }
    public double MaxScore { get; set; }
    public int TimeTakenSeconds { get; set; }
    public bool CompletedWithCheatingFlag { get; set; } = false;
    public int FocusLostCount { get; set; } = 0;
    public string? AnswersJson { get; set; }
}
