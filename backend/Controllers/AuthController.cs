using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SPMS.Data;
using SPMS.DTOs;
using SPMS.Models;
using SPMS.Services;

namespace SPMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TokenService _tokenService;

        public AuthController(AppDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var user = await _context.Users
                    .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                    .SingleOrDefaultAsync(u => u.Email == dto.Email && u.Password == dto.Password && u.IsDeleted != true);

                if (user == null)
                {
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                if (!user.IsActive)
                {
                    return Unauthorized(new { message = "Account is inactive. Please contact your administrator." });
                }

                var roles = user.UserRoles
                    .Where(ur => ur.Role != null)
                    .Select(ur => ur.Role.RoleName)
                    .ToList();

                var token = _tokenService.GenerateToken(user, roles);

                return Ok(new
                {
                    token = token,
                    user = new
                    {
                        userId = user.UserId,
                        fullName = user.FullName,
                        email = user.Email,
                        mobileNumber = user.MobileNumber,
                        profilePicturePath = user.ProfilePicturePath,
                        roles = roles,
                        role = roles.FirstOrDefault() ?? "Student"
                    },
                    message = "Login successful"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during login: " + ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (await _context.Users.AnyAsync(u => u.Email == dto.Email && u.IsDeleted != true))
                {
                    return BadRequest(new { message = "A user with this email address already exists." });
                }

                var user = new User
                {
                    FullName = dto.FullName,
                    Email = dto.Email,
                    Password = dto.Password,
                    MobileNumber = dto.MobileNumber,
                    ProfilePicturePath = string.IsNullOrWhiteSpace(dto.ProfilePicturePath)
                        ? "/images/default-avatar.png"
                        : dto.ProfilePicturePath,
                    IsActive = true,
                    IsDeleted = false
                };

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                var roleName = string.IsNullOrWhiteSpace(dto.RoleName) ? "Student" : dto.RoleName;
                var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == roleName);
                if (role != null)
                {
                    var userRole = new UserRole
                    {
                        UserId = user.UserId,
                        RoleId = role.RoleId
                    };
                    await _context.UserRoles.AddAsync(userRole);
                    await _context.SaveChangesAsync();
                }

                var roles = new List<string> { roleName };
                var token = _tokenService.GenerateToken(user, roles);

                return Ok(new
                {
                    token = token,
                    user = new
                    {
                        userId = user.UserId,
                        fullName = user.FullName,
                        email = user.Email,
                        mobileNumber = user.MobileNumber,
                        profilePicturePath = user.ProfilePicturePath,
                        roles = roles,
                        role = roleName
                    },
                    message = "Registration successful"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during registration: " + ex.Message });
            }
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                           ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Invalid token claims." });
            }

            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.UserId == userId && u.IsDeleted != true);

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            var roles = user.UserRoles
                .Where(ur => ur.Role != null)
                .Select(ur => ur.Role.RoleName)
                .ToList();

            return Ok(new
            {
                userId = user.UserId,
                fullName = user.FullName,
                email = user.Email,
                mobileNumber = user.MobileNumber,
                profilePicturePath = user.ProfilePicturePath,
                isActive = user.IsActive,
                roles = roles,
                role = roles.FirstOrDefault() ?? "Student"
            });
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok(new { message = "Logged out successfully" });
        }
    }
}
