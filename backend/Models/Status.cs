using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SPMS.Models
{
    public class Status
    {
        [Key]
        public int StatusID { get; set; }

        [Required]
        [StringLength(20)]
        public string StatusName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string StatusCssClass { get; set; } = string.Empty;

        public virtual ICollection<Project> Projects { get; set; } = new List<Project>();
        public virtual ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
    }
}
