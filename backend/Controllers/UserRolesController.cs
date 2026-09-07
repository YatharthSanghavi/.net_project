using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SPMS.Data;
using SPMS.DTOs;
using SPMS.Models;

namespace SPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRolesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserRolesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserRoles()
        {
            IQueryable<UserRole> query = _context.UserRoles.AsNoTracking();

            var userRoles = await query.ToListAsync();

            var userRoleDtoList = new List<UserRoleDto>();

            foreach (var ur in userRoles)
            {
                var userRoleDto = new UserRoleDto();
                userRoleDto.RolePermissionId = ur.RolePermissionId;
                userRoleDto.RoleId = ur.RoleId;
                userRoleDto.UserId = ur.UserId;

                userRoleDtoList.Add(userRoleDto);
            }

            return Ok(userRoleDtoList);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserRole(int id)
        {
            var userRole = await _context.UserRoles.FindAsync(id);

            if (userRole == null)
            {
                return NotFound();
            }

            var userRoleDto = new UserRoleDto();
            userRoleDto.RolePermissionId = userRole.RolePermissionId;
            userRoleDto.RoleId = userRole.RoleId;
            userRoleDto.UserId = userRole.UserId;

            return Ok(userRoleDto);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUserRole(UserRoleDto dto)
        {
            var userRole = new UserRole();
            userRole.RoleId = dto.RoleId;
            userRole.UserId = dto.UserId;

            await _context.UserRoles.AddAsync(userRole);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserRole(int id, UserRoleDto dto)
        {
            var userRole = await _context.UserRoles.FindAsync(id);

            if (userRole == null)
            {
                return NotFound();
            }

            userRole.RoleId = dto.RoleId;
            userRole.UserId = dto.UserId;

            _context.UserRoles.Update(userRole);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserRole(int id)
        {
            var userRole = await _context.UserRoles.FindAsync(id);

            if (userRole == null)
            {
                return NotFound();
            }

            _context.UserRoles.Remove(userRole);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}