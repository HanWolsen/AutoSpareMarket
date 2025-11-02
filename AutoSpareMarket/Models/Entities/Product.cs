using AutoSpareMarket.Domain.Models.Abstractions;

namespace AutoSpareMarket.Domain.Models.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DateAdd { get; set; }


        public int? WarehouseCellId { get; set; }
        public WarehoudeCell? WarehouseCell { get; set; }

        public ICollection<Promotion>? Promotions { get; set; }
        public ICollection<SupplierProduct>? SupplierProducts { get; set; }
        public ICollection<OrderItem>? OrderItems { get; set; }
    }
}
