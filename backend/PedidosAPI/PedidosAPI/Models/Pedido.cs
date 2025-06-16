namespace PedidosAPI.Models
{
    public class Pedido
    {
        public int Id { get; set; }
        public int ProdutoId { get; set; }
        public int UsuarioId { get; set; }
        public int Quantidade { get; set; }

        public Produto Produto { get; set; }

        public string Status { get; set; } = string.Empty;
        public DateTime DataCriacao { get; set; }
    }
}
