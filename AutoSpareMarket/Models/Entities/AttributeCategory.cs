using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.Domain.Models.Entities
{
    public class AttributeCategory
    {
        public int AttributeCategoryId { get; set; }
        public AttributeEntity AttributeEntity { get; set; }


        public int? CategoryId { get; set; }
        public Category Category { get; set; }
        public int? ProductId { get; set; }
        public Product Product { get; set; }
    }
}
