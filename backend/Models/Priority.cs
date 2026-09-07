using System.ComponentModel.DataAnnotations;

namespace SPMS.Models
{
    public class Priority
    {
        [Key]
        public int PriorityID {  get; set; }

        [Required]
        [StringLength(20)]
        public string? PriorityName { get; set; }

        [Required]
        [StringLength(20)]
        public string? PriortyCssClass { get; set; }

        public virtual ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
    }
}
