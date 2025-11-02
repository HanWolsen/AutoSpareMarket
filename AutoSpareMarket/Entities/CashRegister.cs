using AutoSpareMarket.Domain.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.Domain.Entities
{
    public class CashRegister : BaseEntity
    {
        public string Name { get; set; }
        public string Location { get; set; }

        public ICollection<Transaction> Transactions { get; set; }
        public ICollection<Sale> Sales { get; set; }
    }
}
