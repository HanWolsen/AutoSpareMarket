using AutoSpareMarket.APIModels.DTO.BaseDTOs;
using AutoSpareMarket.APIModels.DTO.DTOs.SaleItems;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Sales
{
    public class SaleCreateDto : BaseDTO
    {
        public int CustomerId { get; set; }
        public int CashRegisterId { get; set; }
        public string PaymentMethod { get; set; } = null!;
        public List<SaleItemCreateDto> Items { get; set; } = new();
    }
}
