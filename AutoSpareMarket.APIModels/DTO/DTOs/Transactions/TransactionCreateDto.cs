using AutoSpareMarket.APIModels.DTO.BaseDTOs;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Transactions
{
    public class TransactionCreateDto : BaseDTO
    {
        public int SaleId { get; set; }
        public int CashRegisterId { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; } = null!;
        public string? Note { get; set; }
    }
}
