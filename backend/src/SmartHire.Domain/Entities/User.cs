using SmartHire.Domain.Common;
using SmartHire.Domain.Enums;
namespace SmartHire.Domain.Entities;
public class User : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Candidate;
    public string? Phone { get; set; }
    public string? Bio { get; set; }
    public string? ResumeUrl { get; set; }
    public ICollection<Job> PostedJobs { get; set; } = new List<Job>();
    public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
    public ICollection<AssessmentResult> Results { get; set; } = new List<AssessmentResult>();
}
