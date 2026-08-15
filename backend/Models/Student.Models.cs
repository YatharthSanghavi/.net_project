using System.ComponentModel.DataAnnotations;

namespace SPMS.Models
{
    public class Student
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public int EnrollmentNo { get; set; }
        public string Email { get; set; }
    }
}
