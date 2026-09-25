using FluentValidation;
using SPMS.DTOs;

namespace SPMS.Validators
{
    public class RoleValidator : AbstractValidator<RoleDto>
    {
        public RoleValidator()
        {
            RuleFor(x => x.RoleName)
                .NotEmpty()
                .WithMessage("Role name is required.")
                .Length(1, 50)
                .WithMessage("Role name must be between 1 and 50 characters.")
                .Matches(@"^[a-zA-Z0-9\s]*$")
                .WithMessage("Role name can only contain letters, numbers, and spaces.");

            RuleFor(x => x.Description)
                .MaximumLength(250)
                .WithMessage("Role description cannot exceed 250 characters.");
        }
    }
}