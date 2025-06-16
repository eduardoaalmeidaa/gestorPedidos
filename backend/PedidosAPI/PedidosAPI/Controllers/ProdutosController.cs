using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PedidosAPI.Data;
using PedidosAPI.Models;

namespace PedidosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProdutosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /api/produtos
        [HttpGet]
        public async Task<IActionResult> GetProdutos()
        {
            var produtos = await _context.Produtos
                .Select(p => new
                {
                    p.Id,
                    p.Nome,
                    p.Preco,
                    p.QuantidadeEstoque
                })
                .ToListAsync();

            return Ok(produtos);
        }

        // POST: /api/produtos
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CadastrarProduto([FromBody] Produto produto)
        {
            if (string.IsNullOrWhiteSpace(produto.Nome) || produto.Preco <= 0)
                return BadRequest("Nome e preço válidos são obrigatórios.");

            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync();

            return Ok(produto);
        }

        // PUT: /api/produtos/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> EditarProduto(int id, [FromBody] Produto produtoAtualizado)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null)
                return NotFound("Produto não encontrado.");

            if (string.IsNullOrWhiteSpace(produtoAtualizado.Nome) || produtoAtualizado.Preco <= 0)
                return BadRequest("Nome e preço válidos são obrigatórios.");

            produto.Nome = produtoAtualizado.Nome;
            produto.Preco = produtoAtualizado.Preco;
            produto.QuantidadeEstoque = produtoAtualizado.QuantidadeEstoque;

            await _context.SaveChangesAsync();

            return Ok(produto);
        }

        // DELETE: /api/produtos/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletarProduto(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null)
                return NotFound("Produto não encontrado.");

            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();

            return Ok($"Produto {id} deletado com sucesso!");
        }
    }
}
