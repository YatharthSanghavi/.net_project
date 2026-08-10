using Microsoft.EntityFrameworkCore;
using SPMS.Models;
using System.Data;

namespace SPMS.Data
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Status> Statuses { get; set; }
        public DbSet<Priority> Priorities { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectTask> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //User
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            //Project
            modelBuilder.Entity<Project>()
                .Property(p => p.AssignedDate)
                .HasDefaultValueSql("GETDATE()");   

            modelBuilder.Entity<Project>()
                .HasOne(P => P.Student)
                .WithMany(U => U.StudentProjects)
                .HasForeignKey(P => P.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Project>()
                .HasOne(p => p.Faculty)
                .WithMany(u => u.FacultyProjects)
                .HasForeignKey(p => p.FacultyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Project>()
                .HasOne(p => p.Status)
                .WithMany(s => s.Projects)
                .HasForeignKey(p => p.ProjectStatus)
                .OnDelete(DeleteBehavior.Restrict);

            //User
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => ur.RolePermissionId);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            //Tasks
            modelBuilder.Entity<ProjectTask>()
                .HasOne(t => t.Project)
                .WithMany(p => p.Tasks)
                .HasForeignKey(t => t.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProjectTask>()
                .HasOne(t => t.Status)
                .WithMany(s => s.Tasks)
                .HasForeignKey(t => t.TaskStatus)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProjectTask>()
                .HasOne(t => t.Priority)
                .WithMany(pr => pr.Tasks)
                .HasForeignKey(t => t.PriorityID)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
