using AutoSpareMarket.Domain.Models.Abstractions;

namespace AutoSpareMarket.Domain.Models.Entities
{
    public class OrderItem : BaseEntity
    {
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public int ReceivedQuantity { get; set; }

        public int? ProductId { get; set; }
        public Product? Product { get; set; }
        public int? OrderId { get; set; }
        public Order? Order { get; set; }
    }
}
