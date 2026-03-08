namespace SmartHire.Application.Applications.DTOs;
public class ApplicationDto
{
    public Guid Id { get; set; }
    public Guid JobId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public Guid CandidateId { get; set; }
    public string CandidateName { get; set; } = string.Empty;
    public string CandidateEmail { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? CoverLetter { get; set; }
    public double? ReadinessScore { get; set; }
    public DateTime CreatedAt { get; set; }
}
