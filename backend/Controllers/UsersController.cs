using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SPMS.Data;
using SPMS.DTOs;
using SPMS.Models;

namespace SPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            IQueryable<User> query = _context.Users
                .Where(u => u.IsDeleted != true)
                .AsNoTracking();

            var users = await query.ToListAsync();

            var userDtoList = new List<UserDto>();

            foreach (var u in users)
            {
                var userDto = new UserDto();
                userDto.UserId = u.UserId;
                userDto.FullName = u.FullName ?? string.Empty;
                userDto.Email = u.Email ?? string.Empty;
                userDto.Password = u.Password ?? string.Empty;
                userDto.MobileNumber = u.MobileNumber ?? string.Empty;
                userDto.ProfilePicturePath = u.ProfilePicturePath ?? string.Empty;
                userDto.IsActive = u.IsActive;

                userDtoList.Add(userDto);
            }

            return Ok(userDtoList);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null || user.IsDeleted == true)
            {
                return NotFound();
            }

            var userDto = new UserDto();
            userDto.UserId = user.UserId;
            userDto.FullName = user.FullName ?? string.Empty;
            userDto.Email = user.Email ?? string.Empty;
            userDto.Password = user.Password ?? string.Empty;
            userDto.MobileNumber = user.MobileNumber ?? string.Empty;
            userDto.ProfilePicturePath = user.ProfilePicturePath ?? string.Empty;
            userDto.IsActive = user.IsActive;

            return Ok(userDto);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(UserDto dto)
        {
            var user = new User();
            user.FullName = dto.FullName;
            user.Email = dto.Email;
            user.Password = dto.Password;
            user.MobileNumber = dto.MobileNumber;
            user.ProfilePicturePath = dto.ProfilePicturePath;
            user.IsActive = dto.IsActive;
            user.IsDeleted = false;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserDto dto)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null || user.IsDeleted == true)
            {
                return NotFound();
            }

            user.FullName = dto.FullName;
            user.Email = dto.Email;
            user.MobileNumber = dto.MobileNumber;
            user.ProfilePicturePath = dto.ProfilePicturePath;
            user.IsActive = dto.IsActive;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null || user.IsDeleted == true)
            {
                return NotFound();
            }

            user.IsDeleted = true;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}