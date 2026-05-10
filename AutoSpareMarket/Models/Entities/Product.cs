using AutoSpareMarket.Domain.Models.Abstractions;
using AutoSpareMarket.Domain.Models.Entities.FrontEnd;

namespace AutoSpareMarket.Domain.Models.Entities
{
    public class Product : BaseEntity<int>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public string Category { get; set; }
        public string Cell { get; set; }
        public bool InStock { get; set; }
        public DateTime DateAdd { get; set; }


        public int? WarehouseCellId { get; set; }
        public WarehouseCell? WarehouseCell { get; set; }

        // [2.2] Добавить связь с обеих сторон для сущности
        public ICollection<ProductSpecs>? ProductSpecs { get; set; }
        public ICollection<ProductImages>? ProductImages { get; set; }
        public ICollection<Promotion>? Promotions { get; set; }
        public ICollection<SupplierProduct>? SupplierProducts { get; set; }
        public ICollection<OrderItem>? OrderItems { get; set; }
    }
}
