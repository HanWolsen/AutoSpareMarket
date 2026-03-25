using AutoSpareMarket.Domain.Models.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.Domain.Models.Entities
{
    public class AttributeEntity
    {
        public string Name { get; set; }
        public string NameTranslate { get; set; }
        public string Type { get; set; }

        public ICollection<AttributeCategory>? AttributeCategories { get; set; }
    }
}
