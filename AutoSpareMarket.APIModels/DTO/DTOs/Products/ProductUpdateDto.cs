using AutoSpareMarket.APIModels.DTO.BaseDTOs;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Products
{
    public class ProductUpdateDto : BaseDTO
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int WarehouseCellId { get; set; }
    }
}