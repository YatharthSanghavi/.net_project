using System.ComponentModel.DataAnnotations;

namespace SPMS.DTOs
{
    public class UserRoleDto
    {
        public int RolePermissionId { get; set; }

        [Required]
        public int RoleId { get; set; }

        [Required]
        public int UserId { get; set; }
    }
}