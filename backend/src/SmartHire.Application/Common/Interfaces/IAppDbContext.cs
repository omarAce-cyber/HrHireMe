using Microsoft.EntityFrameworkCore;
using SmartHire.Domain.Entities;
namespace SmartHire.Application.Common.Interfaces;
public interface IAppDbContext
{
    DbSet<User> Users { get; }
    DbSet<Job> Jobs { get; }
    DbSet<JobApplication> Applications { get; }
    DbSet<Assessment> Assessments { get; }
    DbSet<Question> Questions { get; }
    DbSet<AssessmentResult> Results { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
