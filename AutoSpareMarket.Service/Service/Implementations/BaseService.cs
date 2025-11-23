using AutoSpareMarket.DAL.Repository.Implementations;
using AutoSpareMarket.DAL.Repository.Intarfacec;
using AutoSpareMarket.Domain.Models.Abstractions;
using AutoSpareMarket.Service.Service.Intarfaces;

namespace AutoSpareMarket.Service.Service.Implementations
{
    public class BaseService<T> : IBaseService<T>
        where T : BaseEntity    
    {
        protected readonly IBaseRepository<T> _baseRepository;

        public BaseService(IBaseRepository<T> baseRepository)
        {
            _baseRepository = baseRepository;
        }
    }
}
