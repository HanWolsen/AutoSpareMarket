using AutoSpareMarket.Domain.Models.Abstractions;
using AutoSpareMarket.Domain.Models.Enums;

namespace AutoSpareMarket.Domain.Models.Entities
{
    public class Transaction : BaseEntity
    {
        public decimal Amount { get; set; }
        public TransactionType Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Note { get; set; }

        public int? SaleId { get; set; }
        public Sale? Sale { get; set; }
        public int? CashRegisterId { get; set; }
        public CashRegister? CashRegister { get; set; }
    }
}
