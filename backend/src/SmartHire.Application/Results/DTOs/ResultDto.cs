namespace SmartHire.Application.Results.DTOs;
public class ResultDto
{
    public Guid Id { get; set; }
    public Guid AssessmentId { get; set; }
    public string AssessmentTitle { get; set; } = string.Empty;
    public Guid CandidateId { get; set; }
    public string CandidateName { get; set; } = string.Empty;
    public double Score { get; set; }
    public double MaxScore { get; set; }
    public double Percentage => MaxScore > 0 ? Math.Round(Score / MaxScore * 100, 1) : 0;
    public int TimeTakenSeconds { get; set; }
    public bool CompletedWithCheatingFlag { get; set; }
    public int FocusLostCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
