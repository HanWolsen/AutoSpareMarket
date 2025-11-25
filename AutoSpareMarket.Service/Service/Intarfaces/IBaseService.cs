using AutoSpareMarket.APIModels.DTO.BaseDTOs;
using AutoSpareMarket.APIModels.Response.Interfaces;
using AutoSpareMarket.Domain.Models.Abstractions;

namespace AutoSpareMarket.Service.Service.Intarfaces
{
    public interface IBaseService<T>
        where T : BaseEntity
    {
        IResponse<T> Create<Tmodel>(Tmodel entityDTO)
            where Tmodel : BaseDTO;

        IResponse<IEnumerable<T>> GetAll();

        IResponse<T> GetById(int id);

        IResponse<bool> Update<Tmodel>(Tmodel entityDTO)
            where Tmodel : BaseDTO;

        IResponse<bool> DeleteById(int id);
    }
}
