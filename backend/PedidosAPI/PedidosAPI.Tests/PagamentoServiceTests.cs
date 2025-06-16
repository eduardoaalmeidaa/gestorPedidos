using PedidosAPI.Models;
using PedidosAPI.Services;
using Xunit;
using System.Threading.Tasks;

namespace PedidosAPI.Tests
{
    public class PagamentoServiceTests
    {
        [Fact]
        public async Task ProcessarPagamento_DeveAtualizarStatusParaAprovadoOuRecusado()
        {
            // Arrange
            var pagamentoService = new PagamentoService();
            var pedido = new Pedido { Id = 1, Status = "Recebido" };

            // Act
            await pagamentoService.ProcessarPagamentoAsync(pedido);

            // Assert
            Assert.True(
                pedido.Status == "Pagamento Aprovado" || pedido.Status == "Pagamento Recusado",
                $"Status inesperado: {pedido.Status}"
            );
        }

        [Fact]
        public async Task ProcessarPagamento_NaoDeveManterStatusOriginal()
        {
            // Arrange
            var pagamentoService = new PagamentoService();
            var pedido = new Pedido { Id = 2, Status = "Recebido" };

            // Act
            await pagamentoService.ProcessarPagamentoAsync(pedido);

            // Assert
            Assert.NotEqual("Recebido", pedido.Status);
        }
    }
}
