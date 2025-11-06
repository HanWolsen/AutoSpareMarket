using AutoSpareMarket.Domain.Models.Abstractions;

namespace AutoSpareMarket.Domain.Models.Entities
{
    public class Sale : BaseEntity
    {
        public string PaymentMethod { get; set; }
        public decimal TotalAmaunt { get; set; }
        public DateTime CreatedAt { get; set; }

        public int? CustomerId { get; set; }
        public Customer? Customer { get; set; }
        public int? CashRegisterId { get; set; }
        public CashRegister? CashRegister { get; set; }

        public ICollection<Transaction>? Transactions { get; set; }
        public ICollection<SaleItem>? SaleItems { get; set; }
    }
}
