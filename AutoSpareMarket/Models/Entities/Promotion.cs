using AutoSpareMarket.Domain.Models.Abstractions;

namespace AutoSpareMarket.Domain.Models.Entities
{
    public class Promotion : BaseEntity
    {
        public string Name { get; set; }
        public string PromotionType { get; set; }
        public int DiscountPercent { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }

        public int? ProductId { get; set; }
        public Product? Product { get; set; }
    }
}
