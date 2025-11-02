using AutoSpareMarket.Domain.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.Domain.Entities
{
    public class Transaction : BaseEntity
    {
        public decimal Amount { get; set; }
        public string Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Note { get; set; }

        public int? SaleId { get; set; }
        public Sale? Sale { get; set; }
        public int? CahsRegisterId { get; set; }
        public CashRegister? CashRegister { get; set; }
    }
}
