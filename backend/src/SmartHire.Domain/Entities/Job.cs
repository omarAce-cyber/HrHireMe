using SmartHire.Domain.Common;
using SmartHire.Domain.Enums;
namespace SmartHire.Domain.Entities;
public class Job : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? SalaryRange { get; set; }
    public JobStatus Status { get; set; } = JobStatus.Open;
    public DateTime? Deadline { get; set; }
    public Guid PostedByUserId { get; set; }
    public User PostedBy { get; set; } = null!;
    public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
    public ICollection<Assessment> Assessments { get; set; } = new List<Assessment>();
}
