using FluentValidation;
using SPMS.DTOs;

namespace SPMS.Validators
{
    public class ProjectValidator : AbstractValidator<ProjectDto>
    {
        public ProjectValidator()
        {
            RuleFor(x => x.ProjectTitle)
                .NotEmpty()
                .WithMessage("Project title is required.")
                .Length(1, 200)
                .WithMessage("Project title must be between 1 and 200 characters.");

            RuleFor(x => x.Description)
                .MaximumLength(1000)
                .WithMessage("Project description cannot exceed 1000 characters.");

            RuleFor(x => x.StudentId)
                .GreaterThan(0)
                .WithMessage("Student ID must be a valid positive number.");

            RuleFor(x => x.FacultyId)
                .GreaterThan(0)
                .WithMessage("Faculty ID must be a valid positive number.");

            RuleFor(x => x.FacultyId)
                .NotEqual(x => x.StudentId)
                .WithMessage("Faculty and Student cannot be the same person.");

            RuleFor(x => x.ProjectStatus)
                .GreaterThan(0)
                .WithMessage("Project status must be a valid positive number.");

            RuleFor(x => x.StartDate)
                .NotEmpty()
                .WithMessage("Start date is required.")
                .LessThan(x => x.EndDate)
                .WithMessage("Start date must be before end date.");

            RuleFor(x => x.EndDate)
                .NotEmpty()
                .WithMessage("End date is required.")
                .GreaterThan(DateTime.Now)
                .WithMessage("End date must be in the future.");

            RuleFor(x => x.TotalTasks)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Total tasks cannot be negative.");

            RuleFor(x => x.CompletedTasks)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Completed tasks cannot be negative.")
                .LessThanOrEqualTo(x => x.TotalTasks)
                .WithMessage("Completed tasks cannot exceed total tasks.");

            RuleFor(x => x.ProgressPercentage)
                .InclusiveBetween(0, 100)
                .WithMessage("Progress percentage must be between 0 and 100.");
        }
    }
}