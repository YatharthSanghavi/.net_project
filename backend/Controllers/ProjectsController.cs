using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SPMS.Data;
using SPMS.DTOs;
using SPMS.Models;

namespace SPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            IQueryable<Project> query = _context.Projects
                .Where(p => p.IsDeleted != true)
                .AsNoTracking();

            var projects = await query.ToListAsync();

            var projectDtoList = new List<ProjectDto>();

            foreach (var p in projects)
            {
                var projectDto = new ProjectDto();
                projectDto.ProjectId = p.ProjectId;
                projectDto.ProjectTitle = p.ProjectTitle;
                projectDto.Description = p.Description;
                projectDto.StudentId = p.StudentId;
                projectDto.FacultyId = p.FacultyId;
                projectDto.AssignedDate = p.AssignedDate;
                projectDto.ProjectStatus = p.ProjectStatus;
                projectDto.StartDate = p.StartDate;
                projectDto.EndDate = p.EndDate;
                projectDto.TotalTasks = p.TotalTasks;
                projectDto.CompletedTasks = p.CompletedTasks;
                projectDto.ProgressPercentage = p.ProgressPercentage;

                projectDtoList.Add(projectDto);
            }

            return Ok(projectDtoList);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);

            if (project == null || project.IsDeleted == true)
            {
                return NotFound();
            }

            var projectDto = new ProjectDto();
            projectDto.ProjectId = project.ProjectId;
            projectDto.ProjectTitle = project.ProjectTitle;
            projectDto.Description = project.Description;
            projectDto.StudentId = project.StudentId;
            projectDto.FacultyId = project.FacultyId;
            projectDto.AssignedDate = project.AssignedDate;
            projectDto.ProjectStatus = project.ProjectStatus;
            projectDto.StartDate = project.StartDate;
            projectDto.EndDate = project.EndDate;
            projectDto.TotalTasks = project.TotalTasks;
            projectDto.CompletedTasks = project.CompletedTasks;
            projectDto.ProgressPercentage = project.ProgressPercentage;

            return Ok(projectDto);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject(ProjectDto dto)
        {
            var project = new Project();
            project.ProjectTitle = dto.ProjectTitle;
            project.Description = dto.Description;
            project.StudentId = dto.StudentId;
            project.FacultyId = dto.FacultyId;
            project.ProjectStatus = dto.ProjectStatus;
            project.StartDate = dto.StartDate;
            project.EndDate = dto.EndDate;
            project.TotalTasks = 0;
            project.CompletedTasks = 0;
            project.ProgressPercentage = 0;
            project.IsDeleted = false;

            await _context.Projects.AddAsync(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, ProjectDto dto)
        {
            var project = await _context.Projects.FindAsync(id);

            if (project == null || project.IsDeleted == true)
            {
                return NotFound();
            }

            project.ProjectTitle = dto.ProjectTitle;
            project.Description = dto.Description;
            project.StudentId = dto.StudentId;
            project.FacultyId = dto.FacultyId;
            project.ProjectStatus = dto.ProjectStatus;
            project.StartDate = dto.StartDate;
            project.EndDate = dto.EndDate;

            _context.Projects.Update(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);

            if (project == null || project.IsDeleted == true)
            {
                return NotFound();
            }

            project.IsDeleted = true;

            _context.Projects.Update(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}