using AutoSpareMarket.APIModels.DTO.BaseDTOs;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Suppliers
{
    public class SupplierShareDto : BaseDTO
    {
        public int SupplierId { get; set; }
        public decimal RevenueSharePercent { get; set; }
        public decimal RevenueAmount { get; set; }
        public int UnitsSold { get; set; }
        public decimal ProfitAmount { get; set; }
        public decimal ProfitSharePercent { get; set; }
    }

}
