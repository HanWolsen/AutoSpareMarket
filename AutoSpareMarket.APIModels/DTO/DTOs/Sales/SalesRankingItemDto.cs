using AutoSpareMarket.APIModels.DTO.BaseDTOs;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Sales
{
    public class SalesRankingItemDto : BaseDTO
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public int UnitsSold { get; set; }
        public decimal Revenue { get; set; }
        public int Rank { get; set; }
    }

}
