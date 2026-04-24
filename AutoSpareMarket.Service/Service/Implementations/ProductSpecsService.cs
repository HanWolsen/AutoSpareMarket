using AutoSpareMarket.DAL.Repository.Intarfacec;
using AutoSpareMarket.DAL.Repository.Interfaces;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Domain.Models.Entities.FrontEnd;
using AutoSpareMarket.Service.Service.Intarfaces;
using AutoSpareMarket.Validation;

namespace AutoSpareMarket.Service.Service.Implementations
{
    public class ProductSpecsService : BaseGuidService<ProductSpecs>, IProductSpecsService
    {
        protected readonly IBaseGuidRepository<ProductSpecs> _productSpecsRepository;
        protected readonly IBaseRepository<Product> _productRepository;


        public ProductSpecsService(
            IBaseGuidRepository<ProductSpecs> productSpecsRepository,
            IBaseRepository<Product> productRepository
            ) : base(productSpecsRepository)
        {
            _productSpecsRepository = productSpecsRepository;
            _productRepository = productRepository;
        }

        //[7.3] Реализовать метод получения изображения по его идентификатору
        public Task<ProductSpecs> GetProductSpecsByPrdouctIdAsync(int id)
        {
            ObjectValidator<int>.CheckIsNotNull(id);

            var productSpecs = _productSpecsRepository.GetAll().FirstOrDefault(pi => pi.ProductId == id);
            return Task.FromResult(productSpecs);
        }
    }
}
