using System.ComponentModel.DataAnnotations;

namespace SPMS.DTOs
{
    public class PriorityDto
    {
        public int PriorityID { get; set; }

        [Required]
        [StringLength(20)]
        public string PriorityName { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string PriortyCssClass { get; set; } = string.Empty;
    }
}