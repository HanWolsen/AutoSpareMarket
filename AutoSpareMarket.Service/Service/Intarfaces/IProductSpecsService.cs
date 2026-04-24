using AutoSpareMarket.Domain.Models.Entities.FrontEnd;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.Service.Service.Intarfaces
{
    public interface IProductSpecsService : IBaseGuidService<ProductSpecs>
    {
        public Task<ProductSpecs> GetProductSpecsByPrdouctIdAsync(int id);
    }
}
