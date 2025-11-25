using AutoSpareMarket.APIModels.DTO.BaseDTOs;

namespace AutoSpareMarket.APIModels.DTO.DTOs.SaleItems
{
    public class SaleItemDto : BaseDTO
    {
        public int Id { get; set; }
        public int? ProductId { get; set; }
        public int? SupplierId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal UnitCost { get; set; }
    }
}
