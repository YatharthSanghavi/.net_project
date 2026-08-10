using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SPMS.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        [StringLength(150)]
        public string? FullName { get; set; }

        [Required]
        [StringLength(150)]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        public string? Password { get; set; }

        [Required]
        [StringLength(15)]
        public string? MobileNumber { get; set; }

        [Required]
        [StringLength(500)]
        public string? ProfilePicturePath { get; set; }

        public bool IsActive { get; set; }

        public bool? IsDeleted { get; set; }

        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public virtual ICollection<Project> StudentProjects { get; set; } = new List<Project>();
        public virtual ICollection<Project> FacultyProjects { get; set; } = new List<Project>();
    }
}