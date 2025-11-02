using AutoSpareMarket.Domain.Models.Abstractions;

namespace AutoSpareMarket.Domain.Models.Entities
{
    public class SellItem : BaseEntity
    {
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal UnitCost { get; set; }

        public int? ProductId { get; set; }
        public Product? Product { get; set; }
        public int? SupplierId { get; set; }
        public Supplier? Supplier { get; set; }
        public int? SaleId { get; set; }
        public Sale? Sale { get; set; }
    }
}
