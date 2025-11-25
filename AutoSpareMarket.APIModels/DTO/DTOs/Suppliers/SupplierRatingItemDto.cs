using AutoSpareMarket.APIModels.DTO.BaseDTOs;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Suppliers
{
    public class SupplierRatingItemDto : BaseDTO
    {
        public int SupplierId { get; set; }
        public string SupplierName { get; set; } = null!;
        public decimal TotalRevenue { get; set; }
        public decimal TotalProfit { get; set; }
        public int UnitsSold { get; set; }
        public int Rank { get; set; }
    }

}
