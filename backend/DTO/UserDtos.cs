using System.ComponentModel.DataAnnotations;

namespace SPMS.DTOs
{
    public class UserDto
    {
        public int UserId { get; set; }

        [Required]
        [StringLength(150)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        [StringLength(15)]
        public string MobileNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string ProfilePicturePath { get; set; } = "/images/default-avatar.png";

        public bool IsActive { get; set; } = true;
    }
}