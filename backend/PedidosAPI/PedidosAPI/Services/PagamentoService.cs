using PedidosAPI.Models;

namespace PedidosAPI.Services
{
    public class PagamentoService
    {
        public async Task ProcessarPagamentoAsync(Pedido pedido)
        {
            var random = new Random();
            int delay = random.Next(2000, 5000);
            await Task.Delay(delay);

            bool pagamentoAprovado = random.NextDouble() < 0.8;

            if (pagamentoAprovado)
            {
                pedido.Status = "Pagamento Aprovado";
                Console.WriteLine($"Item reservado para o pedido {pedido.Id}");
            }
            else
            {
                pedido.Status = "Pagamento Recusado";
                Console.WriteLine($"Cancelando reserva de estoque para o pedido {pedido.Id}");
            }
        }
    }
}
