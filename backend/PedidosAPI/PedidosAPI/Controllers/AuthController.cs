using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PedidosAPI.Data;
using PedidosAPI.DTOs;
using PedidosAPI.Models;
using PedidosAPI.Utils;

namespace PedidosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtTokenGenerator _jwtTokenGenerator;

        public AuthController(AppDbContext context, JwtTokenGenerator jwtTokenGenerator)
        {
            _context = context;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public IActionResult Register([FromBody] RegisterUserDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (_context.Usuarios.Any(u => u.Email == dto.Email))
            {
                return BadRequest("Email já cadastrado.");
            }

            var user = new Usuario
            {
                Nome = dto.Nome,
                Email = dto.Email,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha)
            };

            _context.Usuarios.Add(user);
            _context.SaveChanges();

            return Ok("Usuário cadastrado com sucesso!");
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult Login(LoginUserDTO dto)
        {
            var user = _context.Usuarios.FirstOrDefault(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Senha, user.SenhaHash))
            {
                return Unauthorized("Email ou senha inválidos.");
            }

            var token = _jwtTokenGenerator.GenerateToken(user.Email, user.Id.ToString());

            return Ok(new { Token = token });
        }
    }
}
