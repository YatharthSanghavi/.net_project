using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SPMS.Models
{
    public class ProjectTask
    {
        [Key]
        public int TaskId { get; set; }

        [Required]
        public int ProjectId { get; set; }

        [ForeignKey(nameof(ProjectId))]
        public virtual Project Project { get; set; } = null!;

        [Required]
        [StringLength(200)]
        public string TaskTitle { get; set; } = string.Empty;

        public string? TaskDescription { get; set; }

        [Required]
        public int TaskStatus { get; set; }

        [ForeignKey(nameof(TaskStatus))]
        public virtual Status Status { get; set; } = null!;

        [Required]
        public int PriorityID { get; set; }

        [ForeignKey(nameof(PriorityID))]
        public virtual Priority Priority { get; set; } = null!;

        [Column(TypeName = "decimal(5,2)")]
        public decimal AssignedScore { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? EarnedScore { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal ProgressPercentage { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? DueDate { get; set; }

        public DateTime? CompletedDate { get; set; }

        [StringLength(500)]
        public string? FacultyRemarks { get; set; }

        [StringLength(500)]
        public string? StudentRemarks { get; set; }

        public bool? IsDeleted { get; set; } = false;
    }
}
