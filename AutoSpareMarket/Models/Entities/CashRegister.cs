using AutoSpareMarket.Domain.Models.Abstractions;

namespace AutoSpareMarket.Domain.Models.Entities
{
    public class CashRegister : BaseEntity<int>
    {
        public string Name { get; set; }
        public string Location { get; set; }

        public ICollection<Transaction>? Transactions { get; set; }
        public ICollection<Sale>? Sales { get; set; }
    }
}
