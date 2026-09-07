using System.ComponentModel.DataAnnotations;

namespace SPMS.DTOs
{
    public class StatusDto
    {
        public int StatusID { get; set; }

        [Required]
        [StringLength(20)]
        public string StatusName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string StatusCssClass { get; set; } = string.Empty;
    }
}