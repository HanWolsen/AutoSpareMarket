using AutoSpareMarket.Domain.Abstractions;

namespace AutoSpareMarket.Domain.Entities
{
    public class WarehoudeCell : BaseEntity
    {
        public string CellNumber { get; set; }
        public int Quantity { get; set; }


        public ICollection<Product>? Products { get; set; }
    }
}
