using AutoSpareMarket.Domain.Models.Abstractions;
using AutoSpareMarket.Service.Service.Intarfaces;

namespace AutoSpareMarket.Service.Service.Implementations
{
    public class BaseService<T> : IBaseService<T>
        where T : BaseEntity
    {
       //protected readonly BaseRepository 
    }
}
