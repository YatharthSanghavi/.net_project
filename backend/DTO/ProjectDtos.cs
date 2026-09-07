using System.ComponentModel.DataAnnotations;

namespace SPMS.DTOs
{
    public class ProjectDto
    {
        public int ProjectId { get; set; }

        [Required]
        [StringLength(200)]
        public string ProjectTitle { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public int StudentId { get; set; }

        [Required]
        public int FacultyId { get; set; }

        public DateTime AssignedDate { get; set; }

        [Required]
        public int ProjectStatus { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public int TotalTasks { get; set; }

        public int CompletedTasks { get; set; }

        public decimal ProgressPercentage { get; set; }
    }
}