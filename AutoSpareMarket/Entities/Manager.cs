using AutoSpareMarket.Domain.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.Domain.Entities
{
    public class Manager : BaseEntity
    {
        public string Name { get; set; }
        public string Email { get; set; }

        public ICollection<Order> Orders { get; set; }
    }
}
