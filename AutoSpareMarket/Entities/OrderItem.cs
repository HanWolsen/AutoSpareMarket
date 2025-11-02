using AutoSpareMarket.Domain.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.Domain.Entities
{
    public class OrderItem : BaseEntity
    {
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public int ReceivedQuantity { get; set; }

        public int? ProductId { get; set; }
        public Product? Product { get; set; }
        public int? OrderId { get; set; }
        public Order? Order { get; set; }
    }
}
