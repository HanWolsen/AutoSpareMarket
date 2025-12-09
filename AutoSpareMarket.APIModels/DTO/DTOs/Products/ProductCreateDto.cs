using AutoSpareMarket.APIModels.DTO.BaseDTOs;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Products
{
    public class ProductCreateDto : BaseDTO
    {
        public int WarehouseCellId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
    }
}
