using FluentValidation;
using SPMS.DTOs;

namespace SPMS.Validators
{
    public class UserValidator : AbstractValidator<UserDto>
    {
        public UserValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty()
                .WithMessage("Full name is required.")
                .Length(2, 150)
                .WithMessage("Full name must be between 2 and 150 characters.")
                .Matches(@"^[a-zA-Z\s]*$")
                .WithMessage("Full name can only contain letters and spaces.");

            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage("Email is required.")
                .EmailAddress()
                .WithMessage("Email format is invalid.")
                .Length(1, 150)
                .WithMessage("Email cannot exceed 150 characters.");

            RuleFor(x => x.Password)
                .NotEmpty()
                .WithMessage("Password is required.")
                .MinimumLength(8)
                .WithMessage("Password must be at least 8 characters long.")
                .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]")
                .WithMessage("Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");

            RuleFor(x => x.MobileNumber)
                .NotEmpty()
                .WithMessage("Mobile number is required.")
                .Length(10, 15)
                .WithMessage("Mobile number must be between 10 and 15 characters.")
                .Matches(@"^[0-9+\-\(\) ]+$")
                .WithMessage("Mobile number format is invalid.");

            RuleFor(x => x.ProfilePicturePath)
                .NotEmpty()
                .WithMessage("Profile picture path is required.")
                .Length(1, 500)
                .WithMessage("Profile picture path cannot exceed 500 characters.");

            RuleFor(x => x.IsActive)
                .NotNull()
                .WithMessage("Active status must be specified.");
        }
    }
}