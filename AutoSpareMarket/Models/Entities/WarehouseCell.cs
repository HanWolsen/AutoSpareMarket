using AutoSpareMarket.Domain.Models.Abstractions;

namespace AutoSpareMarket.Domain.Models.Entities
{
    public class WarehouseCell : BaseEntity
    {
        public string CellNumber { get; set; }
        public int Quantity { get; set; }


        public ICollection<Product>? Products { get; set; }
    }
}