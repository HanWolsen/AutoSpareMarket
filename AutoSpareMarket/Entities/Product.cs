using AutoSpareMarket.Domain.Abstractions;

namespace AutoSpareMarket.Domain.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DateAdd { get; set; }

        
        public int? WarehouseCellId { get; set; }
        public WarehoudeCell? WarehouseCell { get; set; }
    }
}
