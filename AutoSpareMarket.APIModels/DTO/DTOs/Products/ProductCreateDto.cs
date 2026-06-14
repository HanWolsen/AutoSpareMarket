using AutoSpareMarket.APIModels.DTO.BaseDTOs;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Products
{
    public class ProductCreateDto : BaseDTO
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string Cell { get; set; }
        public int Price { get; set; }
        public string Category { get; set; }
    }
}
