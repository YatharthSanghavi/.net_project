using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SPMS.Data;
using SPMS.DTOs;
using SPMS.Models;

namespace SPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PriorityController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PriorityController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPriorities()
        {
            IQueryable<Priority> query = _context.Priorities.AsNoTracking();

            var priorities = await query.ToListAsync();

            var priorityDtoList = new List<PriorityDto>();

            foreach (var p in priorities)
            {
                var priorityDto = new PriorityDto();
                priorityDto.PriorityID = p.PriorityID;
                priorityDto.PriorityName = p.PriorityName;
                priorityDto.PriortyCssClass = p.PriortyCssClass;

                priorityDtoList.Add(priorityDto);
            }

            return Ok(priorityDtoList);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPriority(int id)
        {
            var priority = await _context.Priorities.FindAsync(id);

            if (priority == null)
            {
                return NotFound();
            }

            var priorityDto = new PriorityDto();
            priorityDto.PriorityID = priority.PriorityID;
            priorityDto.PriorityName = priority.PriorityName;
            priorityDto.PriortyCssClass = priority.PriortyCssClass;

            return Ok(priorityDto);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePriority(PriorityDto dto)
        {
            var priority = new Priority();
            priority.PriorityName = dto.PriorityName;
            priority.PriortyCssClass = dto.PriortyCssClass;

            await _context.Priorities.AddAsync(priority);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePriority(int id, PriorityDto dto)
        {
            var priority = await _context.Priorities.FindAsync(id);

            if (priority == null)
            {
                return NotFound();
            }

            priority.PriorityName = dto.PriorityName;
            priority.PriortyCssClass = dto.PriortyCssClass;

            _context.Priorities.Update(priority);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePriority(int id)
        {
            var priority = await _context.Priorities.FindAsync(id);

            if (priority == null)
            {
                return NotFound();
            }

            _context.Priorities.Remove(priority);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}