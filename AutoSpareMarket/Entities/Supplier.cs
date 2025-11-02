using AutoSpareMarket.Domain.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.Domain.Entities
{
    public class Supplier : BaseEntity
    {
        public string Name { get; set; }
        public string Country { get; set; }
        public bool IsActive { get; set; }
        public string CountryInfo { get; set; }
        public DateTime CreateAt { get; set; }

        public ICollection<SupplierProduct> SupplierProducts { get; set; }
        public ICollection<Order> Orders { get; set; }
        public ICollection<SellItem> SellItems { get; set; }
    }
}
