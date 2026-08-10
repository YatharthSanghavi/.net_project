using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SPMS.Models
{
    public class Project
    {
        [Key]
        public int ProjectId { get; set; }

        [Required]
        [StringLength(200)]
        public string ProjectTitle { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public int StudentId { get; set; }

        [ForeignKey(nameof(StudentId))]
        public virtual User Student { get; set; } = null!;

        [Required]
        public int FacultyId { get; set; }

        [ForeignKey(nameof(FacultyId))]
        public virtual User Faculty { get; set; } = null!;

        public DateTime AssignedDate { get; set; } = DateTime.Now;

        public bool? IsDeleted { get; set; } = false;

        [Required]
        public int ProjectStatus { get; set; }

        [ForeignKey(nameof(ProjectStatus))]
        public virtual Status Status { get; set; } = null!;

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int TotalTasks { get; set; }

        public int CompletedTasks { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal ProgressPercentage { get; set; }

        public virtual ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
    }
}
