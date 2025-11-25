using AutoSpareMarket.APIModels.DTO.BaseDTOs;

namespace AutoSpareMarket.APIModels.DTO.DTOs.WarehouseCells
{ 
    public class WarehouseCellDto : BaseDTO
    {
        public int Id { get; set; }
        public string CellNumber { get; set; } = null!;
        public int Quantity { get; set; }
    }
}
