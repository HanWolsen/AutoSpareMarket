using AutoSpareMarket.APIModels.DTO.BaseDTOs;
using AutoSpareMarket.Domain.Models.Enums;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Transactions
{
    public class TransactionCreateDto : BaseDTO
    {
        public int SaleId { get; set; }
        public int CashRegisterId { get; set; }
        public decimal Amount { get; set; }
        public TransactionType Type { get; set; }
        public string? Note { get; set; }
    }
}
