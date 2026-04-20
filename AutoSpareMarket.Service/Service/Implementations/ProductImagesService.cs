using AutoSpareMarket.DAL.Repository.Intarfacec;
using AutoSpareMarket.DAL.Repository.Interfaces;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Domain.Models.Entities.FrontEnd;
using AutoSpareMarket.Service.Service.Intarfaces;
using AutoSpareMarket.Validation;

namespace AutoSpareMarket.Service.Service.Implementations
{
    // [7.2] Реализовать сервис для работы с сущностью ProductImages
    public class ProductImagesService : BaseGuidService<ProductImages>, IProductImagesService
    {
        protected readonly IBaseGuidRepository<ProductImages> _productImagesRepository;
        protected readonly IBaseRepository<Product> _productRepository;


        public ProductImagesService(
            IBaseGuidRepository<ProductImages> productImagesRepository, 
            IBaseRepository<Product> productRepository
            ) : base(productImagesRepository)
        {
            _productImagesRepository = productImagesRepository;
            _productRepository = productRepository;
        }

        //[7.3] Реализовать метод получения изображения по его идентификатору
        public Task<ProductImages> GetProductImageByPrdouctIdAsync(int id)
        {
            ObjectValidator<int>.CheckIsNotNull(id);

            var productImage = _productImagesRepository.GetAll().FirstOrDefault(pi => pi.ProductId == id);
            return Task.FromResult(productImage);
        }
    }
}
