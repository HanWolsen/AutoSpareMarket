using AutoSpareMarket.APIModels.DTO.BaseDTOs;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Transactions
{
    public class TransactionDto : BaseDTO
    {
        public int Id { get; set; }
        public int SaleId { get; set; }
        public int CashRegisterId { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public string? Note { get; set; }
    }
}
