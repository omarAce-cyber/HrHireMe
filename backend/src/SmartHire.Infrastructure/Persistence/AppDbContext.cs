using Microsoft.EntityFrameworkCore;
using SmartHire.Application.Common.Interfaces;
using SmartHire.Domain.Entities;
namespace SmartHire.Infrastructure.Persistence;
public class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<User> Users => Set<User>();
    public DbSet<Job> Jobs => Set<Job>();
    public DbSet<JobApplication> Applications => Set<JobApplication>();
    public DbSet<Assessment> Assessments => Set<Assessment>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<AssessmentResult> Results => Set<AssessmentResult>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<User>(e => { e.HasIndex(u => u.Email).IsUnique(); });
        modelBuilder.Entity<Job>(e => {
            e.HasOne(j => j.PostedBy).WithMany(u => u.PostedJobs).HasForeignKey(j => j.PostedByUserId).OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<JobApplication>(e => {
            e.HasIndex(a => new { a.JobId, a.CandidateId }).IsUnique();
            e.HasOne(a => a.Job).WithMany(j => j.Applications).HasForeignKey(a => a.JobId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(a => a.Candidate).WithMany(u => u.Applications).HasForeignKey(a => a.CandidateId).OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<Assessment>(e => {
            e.HasOne(a => a.Job).WithMany(j => j.Assessments).HasForeignKey(a => a.JobId).OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<Question>(e => {
            e.HasOne(q => q.Assessment).WithMany(a => a.Questions).HasForeignKey(q => q.AssessmentId).OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<AssessmentResult>(e => {
            e.HasOne(r => r.Assessment).WithMany(a => a.Results).HasForeignKey(r => r.AssessmentId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(r => r.Candidate).WithMany(u => u.Results).HasForeignKey(r => r.CandidateId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}
