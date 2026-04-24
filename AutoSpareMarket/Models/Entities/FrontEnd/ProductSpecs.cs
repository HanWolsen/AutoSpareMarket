using AutoSpareMarket.Domain.Models.Abstractions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.Domain.Models.Entities.FrontEnd
{
    public class ProductSpecs : BaseEntity<Guid>
    {
        public int? ProductId { get; set; }
        public Product? Product { get; set; }
        public string SpecKey { get; set; }
        public string SpecValue { get; set; }
        public int SortOrder { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CategorySlug { get; set; }
    }
}
