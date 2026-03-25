namespace AutoSpareMarket.Domain.Models.Entities
{
    public class AttributeProduct
    {
        public int ProductId { get; set; }
        public ICollection<Product>? Products { get; set; }
    }
}
