using AutoSpareMarket.APIModels.DTO.BaseDTOs;

namespace AutoSpareMarket.APIModels.DTO.DTOs.WarehouseCells
{
    public class WarehouseCellUpdateDto : BaseDTO
    {
        public string CellNumber { get; set; } = null!;
        public int Quantity { get; set; }
    }
}
