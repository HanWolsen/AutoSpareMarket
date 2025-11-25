using AutoSpareMarket.APIModels.DTO.BaseDTOs;
using AutoSpareMarket.Domain.Models.Enums;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Transactions
{
    public class TransactionDto : BaseDTO
    {
        public int Id { get; set; }
        public int? SaleId { get; set; }
        public int? CashRegisterId { get; set; }
        public decimal Amount { get; set; }
        public TransactionType Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Note { get; set; }
    }
}
