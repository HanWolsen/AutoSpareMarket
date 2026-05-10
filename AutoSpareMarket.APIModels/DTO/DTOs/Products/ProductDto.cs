using AutoSpareMarket.APIModels.DTO.BaseDTOs;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Products
{
    public class ProductDto : BaseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int WarehouseCell { get; set; }
        public int Price { get; set; }
        public string Category { get; set; }
        public string InStock { get; set; }

        public DateTime DateAdd { get; set; }
    }
}