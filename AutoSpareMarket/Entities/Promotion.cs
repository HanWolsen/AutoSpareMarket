using AutoSpareMarket.Domain.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.Domain.Entities
{
    public class Promotion : BaseEntity
    {
        public string Name { get; set; }
        public string PromotionType { get; set; }
        public int DiscountPercent { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }

        public int? ProductId { get; set; }
        public Product? Product { get; set; }
    }
}
