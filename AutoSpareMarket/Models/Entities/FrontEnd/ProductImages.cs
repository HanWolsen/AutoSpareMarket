using AutoSpareMarket.Domain.Models.Abstractions;

namespace AutoSpareMarket.Domain.Models.Entities.FrontEnd
{

    // [1] Создать сущность
    public class ProductImages : BaseEntity<Guid>
    {
        // [2.1] Добавить связь с обеих сторон для сущности
        public int? ProductId { get; set; }
        public Product? Product { get; set; }
        public string ImageUrl { get; set; }
        public bool IsPrimary { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
