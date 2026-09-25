using FluentValidation;
using SPMS.DTOs;

namespace SPMS.Validators
{
    public class ProjectTaskValidator : AbstractValidator<ProjectTaskDto>
    {
        public ProjectTaskValidator()
        {
            RuleFor(x => x.ProjectId)
                .GreaterThan(0)
                .WithMessage("Project ID must be a valid positive number.");

            RuleFor(x => x.TaskTitle)
                .NotEmpty()
                .WithMessage("Task title is required.")
                .Length(1, 200)
                .WithMessage("Task title must be between 1 and 200 characters.");

            RuleFor(x => x.TaskDescription)
                .MaximumLength(1000)
                .WithMessage("Task description cannot exceed 1000 characters.");

            RuleFor(x => x.TaskStatus)
                .GreaterThan(0)
                .WithMessage("Task status must be a valid positive number.");

            RuleFor(x => x.PriorityID)
                .GreaterThan(0)
                .WithMessage("Priority ID must be a valid positive number.");

            RuleFor(x => x.AssignedScore)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Assigned score cannot be negative.")
                .LessThanOrEqualTo(1000)
                .WithMessage("Assigned score cannot exceed 1000.");

            RuleFor(x => x.EarnedScore)
                .GreaterThanOrEqualTo(0)
                .When(x => x.EarnedScore.HasValue)
                .WithMessage("Earned score cannot be negative.")
                .LessThanOrEqualTo(x => x.AssignedScore)
                .When(x => x.EarnedScore.HasValue)
                .WithMessage("Earned score cannot exceed assigned score.");

            RuleFor(x => x.StartDate)
                .LessThan(x => x.DueDate)
                .When(x => x.StartDate.HasValue && x.DueDate.HasValue)
                .WithMessage("Start date must be before due date.");

            RuleFor(x => x.DueDate)
                .GreaterThan(DateTime.Now)
                .When(x => x.DueDate.HasValue)
                .WithMessage("Due date must be in the future.");

            RuleFor(x => x.FacultyRemarks)
                .MaximumLength(500)
                .WithMessage("Faculty remarks cannot exceed 500 characters.");

            RuleFor(x => x.StudentRemarks)
                .MaximumLength(500)
                .WithMessage("Student remarks cannot exceed 500 characters.");
        }
    }
}