using AutoSpareMarket.Domain.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.Domain.Entities
{
    public class SellItem : BaseEntity
    {
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal UniyCost { get; set; }

        public int? ProductId { get; set; }
        public Product? Product { get; set; }
        public int? SupplierId { get; set; }
        public Supplier? Supplier { get; set; }
        public int? SaleId { get; set; }
        public Sale? Sale { get; set; }
    }
}
