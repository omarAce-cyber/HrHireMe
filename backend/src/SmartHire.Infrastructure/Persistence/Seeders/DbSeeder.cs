using Microsoft.EntityFrameworkCore;
using SmartHire.Domain.Entities;
using SmartHire.Domain.Enums;
namespace SmartHire.Infrastructure.Persistence.Seeders;
public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await context.Database.MigrateAsync();
        if (await context.Users.AnyAsync()) return;
        var admin = new User
        {
            FirstName = "Admin", LastName = "User", Email = "admin@smarthire.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"), Role = UserRole.Admin
        };
        var hr = new User
        {
            FirstName = "Sarah", LastName = "HR", Email = "hr@smarthire.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("HR@123456"), Role = UserRole.HR
        };
        var candidate = new User
        {
            FirstName = "John", LastName = "Doe", Email = "candidate@smarthire.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Candidate@123"), Role = UserRole.Candidate,
            Bio = "Experienced software engineer looking for new opportunities."
        };
        context.Users.AddRange(admin, hr, candidate);
        await context.SaveChangesAsync();
        var job = new Job
        {
            Title = "Senior Software Engineer", Description = "We are looking for an experienced software engineer to join our team.",
            Department = "Engineering", Location = "Remote", SalaryRange = "$80k - $120k",
            PostedByUserId = hr.Id, Status = JobStatus.Open
        };
        context.Jobs.Add(job);
        await context.SaveChangesAsync();
        var assessment = new Assessment
        {
            Title = "Software Engineering Assessment", Description = "Test your software engineering knowledge.",
            TimeLimitMinutes = 30, IsRandomized = true, JobId = job.Id
        };
        assessment.Questions.Add(new Question
        {
            Text = "What does SOLID stand for in software engineering?",
            OptionA = "Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion",
            OptionB = "Simple, Organized, Lightweight, Integrated, Distributed",
            OptionC = "Scalable, Object-oriented, Layered, Independent, Dynamic",
            OptionD = "Structured, Optimized, Linked, Integrated, Distributed",
            CorrectAnswer = 'A', Points = 2
        });
        assessment.Questions.Add(new Question
        {
            Text = "What is the time complexity of binary search?",
            OptionA = "O(n)", OptionB = "O(n²)", OptionC = "O(log n)", OptionD = "O(1)",
            CorrectAnswer = 'C', Points = 1
        });
        assessment.Questions.Add(new Question
        {
            Text = "Which HTTP method is idempotent and safe?",
            OptionA = "POST", OptionB = "PUT", OptionC = "DELETE", OptionD = "GET",
            CorrectAnswer = 'D', Points = 1
        });
        context.Assessments.Add(assessment);
        await context.SaveChangesAsync();
    }
}
