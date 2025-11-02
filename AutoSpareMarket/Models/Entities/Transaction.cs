using AutoSpareMarket.Domain.Models.Abstractions;
using System.Diagnostics;

namespace AutoSpareMarket.Domain.Models.Entities
{
    public class Transaction : BaseEntity
    {
        public decimal Amount { get; set; }
        public TraceEventType Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Note { get; set; }

        public int? SaleId { get; set; }
        public Sale? Sale { get; set; }
        public int? CahsRegisterId { get; set; }
        public CashRegister? CashRegister { get; set; }
    }
}
