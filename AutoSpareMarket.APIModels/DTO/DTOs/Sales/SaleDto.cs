using AutoSpareMarket.APIModels.DTO.BaseDTOs;
using AutoSpareMarket.APIModels.DTO.DTOs.SaleItems;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Sales
{
    public class SaleDto : BaseDTO
    {
        public int Id { get; set; }
        public int? CustomerId { get; set; }
        public int? CashRegisterId { get; set; }
        public string PaymentMethod { get; set; } = null!;
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<SaleItemDto> Items { get; set; } = new();
    }
}
