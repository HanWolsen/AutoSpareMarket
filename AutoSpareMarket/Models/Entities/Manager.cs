using AutoSpareMarket.Domain.Models.Abstractions;

namespace AutoSpareMarket.Domain.Models.Entities
{
    public class Manager : BaseEntity
    {
        public string Name { get; set; }
        public string Email { get; set; }

        public ICollection<Order>? Orders { get; set; }
    }
}
