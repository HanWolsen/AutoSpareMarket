using AutoSpareMarket.APIModels.DTO.BaseDTOs;
using AutoSpareMarket.APIModels.Response.Helpers;
using AutoSpareMarket.APIModels.Response.Interfaces;
using AutoSpareMarket.DAL.Repository.Intarfacec;
using AutoSpareMarket.Domain.Models.Abstractions;
using AutoSpareMarket.Service.Helpers.Maping;
using AutoSpareMarket.Service.Service.Intarfaces;
using AutoSpareMarket.Validation;

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

        public IResponse<T> Create<Tmodel>(Tmodel entityDTO)
            where Tmodel : BaseDTO
        {
            try
            {
                ObjectValidator<Tmodel>.CheckIsNotNull(entityDTO);

                var entity = MapperHelper<Tmodel, T>.Map(entityDTO);

                _baseRepository.Create(entity);

                return ResponseFactory<T>.CreateSuccessResponse(entity);
            }
            catch(Exception exception)
            {
                return ResponseFactory<T>.CreateErrorResponse(exception);
            }
        }

        public IResponse<IEnumerable<T>> GetAll()
        {
            try
            {
                var entities = _baseRepository.GetAll();

                ObjectValidator<IEnumerable<T>>.CheckIsNotNull(entities);

                return ResponseFactory<IEnumerable<T>>.CreateSuccessResponse(entities);
            }
            catch (Exception exception)
            {
                return ResponseFactory<IEnumerable<T>>.CreateErrorResponse(exception);
            }
        }

        public IResponse<T> GetById(int id)
        {
            try
            {
                var entity = _baseRepository.GetById(id);

                ObjectValidator<T>.CheckIsNotNull(entity);

                return ResponseFactory<T>.CreateSuccessResponse(entity);
            }
            catch (Exception exception)
            {
                return ResponseFactory<T>.CreateErrorResponse(exception);
            }
        }

        public IResponse<bool> Update<Tmodel>(Tmodel entityDTO)
            where Tmodel : BaseDTO
        {
            try
            {
                ObjectValidator<Tmodel>.CheckIsNotNull(entityDTO);

                var entity = MapperHelper<Tmodel, T>.Map(entityDTO);

                _baseRepository.Update(entity);

                return ResponseFactory<bool>.CreateSuccessResponse(true);
            }
            catch (Exception exception)
            {
                return ResponseFactory<bool>.CreateErrorResponse(exception);
            }
        }

        public IResponse<bool> DeleteById(int id)
        {
            try
            {
                var entity = _baseRepository.GetById(id);

                ObjectValidator<T>.CheckIsNotNull(entity);

                _baseRepository.Delete(entity);

                return ResponseFactory<bool>.CreateSuccessResponse(true);
            }
            catch (Exception exception)
            {
                return ResponseFactory<bool>.CreateErrorResponse(exception);
            }
        }
    }
}
