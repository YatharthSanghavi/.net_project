using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SPMS.Data;
using SPMS.DTOs;
using SPMS.Models;

namespace SPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StatusController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetStatuses()
        {
            IQueryable<Status> query = _context.Statuses.AsNoTracking();

            var statuses = await query.ToListAsync();

            var statusDtoList = new List<StatusDto>();

            foreach (var s in statuses)
            {
                var statusDto = new StatusDto();
                statusDto.StatusID = s.StatusID;
                statusDto.StatusName = s.StatusName;
                statusDto.StatusCssClass = s.StatusCssClass;

                statusDtoList.Add(statusDto);
            }

            return Ok(statusDtoList);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStatus(int id)
        {
            var status = await _context.Statuses.FindAsync(id);

            if (status == null)
            {
                return NotFound();
            }

            var statusDto = new StatusDto();
            statusDto.StatusID = status.StatusID;
            statusDto.StatusName = status.StatusName;
            statusDto.StatusCssClass = status.StatusCssClass;

            return Ok(statusDto);
        }

        [HttpPost]
        public async Task<IActionResult> CreateStatus(StatusDto dto)
        {
            var status = new Status();
            status.StatusName = dto.StatusName;
            status.StatusCssClass = dto.StatusCssClass;

            await _context.Statuses.AddAsync(status);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStatus(int id, StatusDto dto)
        {
            var status = await _context.Statuses.FindAsync(id);

            if (status == null)
            {
                return NotFound();
            }

            status.StatusName = dto.StatusName;
            status.StatusCssClass = dto.StatusCssClass;

            _context.Statuses.Update(status);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStatus(int id)
        {
            var status = await _context.Statuses.FindAsync(id);

            if (status == null)
            {
                return NotFound();
            }

            _context.Statuses.Remove(status);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}