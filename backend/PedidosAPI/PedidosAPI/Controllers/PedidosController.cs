using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PedidosAPI.Data;
using PedidosAPI.DTOs;
using PedidosAPI.Models;
using PedidosAPI.Services;
using System.Security.Claims;

namespace PedidosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PedidosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PagamentoService _pagamentoService;

        public PedidosController(AppDbContext context, PagamentoService pagamentoService)
        {
            _context = context;
            _pagamentoService = pagamentoService;
        }

        [HttpPost]
        public async Task<IActionResult> CriarPedido([FromBody] CriarPedidoDTO dto)
        {
            var produto = await _context.Produtos.FindAsync(dto.ProdutoId);
            if (produto == null)
                return NotFound("Produto não encontrado.");

            if (dto.Quantidade < 1)
                return BadRequest("A quantidade deve ser maior que zero.");

            if (dto.Quantidade > produto.QuantidadeEstoque)
                return BadRequest("Quantidade solicitada maior que o estoque disponível.");

            var usuarioId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var pedido = new Pedido
            {
                ProdutoId = dto.ProdutoId,
                UsuarioId = usuarioId,
                Status = "Recebido",
                DataCriacao = DateTime.UtcNow,
                Quantidade = dto.Quantidade
            };

            produto.QuantidadeEstoque -= dto.Quantidade;

            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();

            // ✅ Agora chama o serviço de pagamento
            await _pagamentoService.ProcessarPagamentoAsync(pedido);
            await _context.SaveChangesAsync();

            return Ok(pedido);
        }

        [HttpGet]
        public async Task<IActionResult> GetPedidosDoUsuario()
        {
            var usuarioId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var pedidos = await _context.Pedidos
                .Include(p => p.Produto)
                .Where(p => p.UsuarioId == usuarioId)
                .Select(p => new
                {
                    p.Id,
                    ProdutoNome = p.Produto.Nome,
                    Quantidade = p.Quantidade,
                    p.Status,
                    p.DataCriacao
                })
                .ToListAsync();

            return Ok(pedidos);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditarPedido(int id, [FromBody] EditarPedidoDTO dto)
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido == null)
                return NotFound("Pedido não encontrado.");

            if (dto.Quantidade < 1)
                return BadRequest("A quantidade deve ser maior que zero.");

            pedido.Quantidade = dto.Quantidade;
            await _context.SaveChangesAsync();

            return Ok(pedido);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletarPedido(int id)
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido == null)
                return NotFound("Pedido não encontrado.");

            _context.Pedidos.Remove(pedido);
            await _context.SaveChangesAsync();

            return Ok($"Pedido {id} deletado com sucesso!");
        }
    }
}
