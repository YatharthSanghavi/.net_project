using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SPMS.Data;
using SPMS.DTOs;
using SPMS.Models;

namespace SPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            IQueryable<ProjectTask> query = _context.Tasks
                .Where(t => t.IsDeleted != true)
                .AsNoTracking();

            var tasks = await query.ToListAsync();

            var taskDtoList = new List<ProjectTaskDto>();

            foreach (var t in tasks)
            {
                var taskDto = new ProjectTaskDto();
                taskDto.TaskId = t.TaskId;
                taskDto.ProjectId = t.ProjectId;
                taskDto.TaskTitle = t.TaskTitle;
                taskDto.TaskDescription = t.TaskDescription;
                taskDto.TaskStatus = t.TaskStatus;
                taskDto.PriorityID = t.PriorityID;
                taskDto.AssignedScore = t.AssignedScore;
                taskDto.EarnedScore = t.EarnedScore;
                taskDto.ProgressPercentage = t.ProgressPercentage;
                taskDto.StartDate = t.StartDate;
                taskDto.DueDate = t.DueDate;
                taskDto.CompletedDate = t.CompletedDate;
                taskDto.FacultyRemarks = t.FacultyRemarks;
                taskDto.StudentRemarks = t.StudentRemarks;

                taskDtoList.Add(taskDto);
            }

            return Ok(taskDtoList);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null || task.IsDeleted == true)
            {
                return NotFound();
            }

            var taskDto = new ProjectTaskDto();
            taskDto.TaskId = task.TaskId;
            taskDto.ProjectId = task.ProjectId;
            taskDto.TaskTitle = task.TaskTitle;
            taskDto.TaskDescription = task.TaskDescription;
            taskDto.TaskStatus = task.TaskStatus;
            taskDto.PriorityID = task.PriorityID;
            taskDto.AssignedScore = task.AssignedScore;
            taskDto.EarnedScore = task.EarnedScore;
            taskDto.ProgressPercentage = task.ProgressPercentage;
            taskDto.StartDate = task.StartDate;
            taskDto.DueDate = task.DueDate;
            taskDto.CompletedDate = task.CompletedDate;
            taskDto.FacultyRemarks = task.FacultyRemarks;
            taskDto.StudentRemarks = task.StudentRemarks;

            return Ok(taskDto);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask(ProjectTaskDto dto)
        {
            var task = new ProjectTask();
            task.ProjectId = dto.ProjectId;
            task.TaskTitle = dto.TaskTitle;
            task.TaskDescription = dto.TaskDescription;
            task.TaskStatus = dto.TaskStatus;
            task.PriorityID = dto.PriorityID;
            task.AssignedScore = dto.AssignedScore;
            task.EarnedScore = dto.EarnedScore;
            task.StartDate = dto.StartDate;
            task.DueDate = dto.DueDate;
            task.CompletedDate = dto.CompletedDate;
            task.FacultyRemarks = dto.FacultyRemarks;
            task.StudentRemarks = dto.StudentRemarks;
            task.IsDeleted = false;

            if (task.CompletedDate != null)
            {
                task.ProgressPercentage = 100;
            }
            else if (task.AssignedScore > 0 && task.EarnedScore != null)
            {
                task.ProgressPercentage = (task.EarnedScore.Value / task.AssignedScore) * 100;
            }
            else
            {
                task.ProgressPercentage = 0;
            }

            await _context.Tasks.AddAsync(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, ProjectTaskDto dto)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null || task.IsDeleted == true)
            {
                return NotFound();
            }

            task.ProjectId = dto.ProjectId;
            task.TaskTitle = dto.TaskTitle;
            task.TaskDescription = dto.TaskDescription;
            task.TaskStatus = dto.TaskStatus;
            task.PriorityID = dto.PriorityID;
            task.AssignedScore = dto.AssignedScore;
            task.EarnedScore = dto.EarnedScore;
            task.StartDate = dto.StartDate;
            task.DueDate = dto.DueDate;
            task.CompletedDate = dto.CompletedDate;
            task.FacultyRemarks = dto.FacultyRemarks;
            task.StudentRemarks = dto.StudentRemarks;

            if (task.CompletedDate != null)
            {
                task.ProgressPercentage = 100;
            }
            else if (task.AssignedScore > 0 && task.EarnedScore != null)
            {
                task.ProgressPercentage = (task.EarnedScore.Value / task.AssignedScore) * 100;
            }
            else
            {
                task.ProgressPercentage = 0;
            }

            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null || task.IsDeleted == true)
            {
                return NotFound();
            }

            task.IsDeleted = true;

            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}