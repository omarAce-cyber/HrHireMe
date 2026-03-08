namespace SmartHire.Application.Jobs.DTOs;
public class JobDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? SalaryRange { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? Deadline { get; set; }
    public string PostedByName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int ApplicationCount { get; set; }
}
