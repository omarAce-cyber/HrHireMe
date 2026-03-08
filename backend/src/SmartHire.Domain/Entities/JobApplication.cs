using SmartHire.Domain.Common;
using SmartHire.Domain.Enums;
namespace SmartHire.Domain.Entities;
public class JobApplication : BaseEntity
{
    public Guid JobId { get; set; }
    public Job Job { get; set; } = null!;
    public Guid CandidateId { get; set; }
    public User Candidate { get; set; } = null!;
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;
    public string? CoverLetter { get; set; }
    public double? ReadinessScore { get; set; }
}
