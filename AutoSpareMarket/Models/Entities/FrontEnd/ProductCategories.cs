using AutoSpareMarket.Domain.Models.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.Domain.Models.Entities.FrontEnd
{
    public class ProductCategories : BaseEntity<Guid>
    {
        public string Name { get; set; }
        public string Slug { get; set; }
        public string? ParentSlug { get; set; }
        public int SortOrder { get; set; }
    }
}
