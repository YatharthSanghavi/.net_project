using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SPMS.Data;
using SPMS.DTOs;
using SPMS.Models;

namespace SPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RolesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            IQueryable<Role> query = _context.Roles.AsNoTracking();

            var roles = await query.ToListAsync();

            var roleDtoList = new List<RoleDto>();

            foreach (var r in roles)
            {
                var roleDto = new RoleDto();
                roleDto.RoleId = r.RoleId;
                roleDto.RoleName = r.RoleName;
                roleDto.Description = r.Description;

                roleDtoList.Add(roleDto);
            }

            return Ok(roleDtoList);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRole(int id)
        {
            var role = await _context.Roles.FindAsync(id);

            if (role == null)
            {
                return NotFound();
            }

            var roleDto = new RoleDto();
            roleDto.RoleId = role.RoleId;
            roleDto.RoleName = role.RoleName;
            roleDto.Description = role.Description;

            return Ok(roleDto);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRole(RoleDto dto)
        {
            var role = new Role();
            role.RoleName = dto.RoleName;
            role.Description = dto.Description;

            await _context.Roles.AddAsync(role);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(int id, RoleDto dto)
        {
            var role = await _context.Roles.FindAsync(id);

            if (role == null)
            {
                return NotFound();
            }

            role.RoleName = dto.RoleName;
            role.Description = dto.Description;

            _context.Roles.Update(role);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            var role = await _context.Roles.FindAsync(id);

            if (role == null)
            {
                return NotFound();
            }

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}