using AutoSpareMarket.Domain.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.Domain.Entities
{
    public class Order : BaseEntity
    {
        public int TotalAmount { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }

        public int? SuplierId { get; set; }
        public Supplier? Supplier { get; set; }
        public int? ManagerId { get; set; }
        public Manager? Manager { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; }
    }
}
