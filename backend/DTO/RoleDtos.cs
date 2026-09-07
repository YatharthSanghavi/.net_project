using System.ComponentModel.DataAnnotations;

namespace SPMS.DTOs
{
    public class RoleDto
    {
        public int RoleId { get; set; }

        [Required]
        [StringLength(50)]
        public string RoleName { get; set; } = string.Empty;

        [StringLength(250)]
        public string? Description { get; set; }
    }
}