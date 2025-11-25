using AutoSpareMarket.APIModels.DTO.DTOs.Suppliers;
using AutoSpareMarket.APIModels.Response.Helpers;
using AutoSpareMarket.APIModels.Response.Interfaces;
using AutoSpareMarket.DAL.Repository.Intarfacec;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Service.Interfaces;
using AutoSpareMarket.Validation;

namespace AutoSpareMarket.Service.Services
{
    public class ProductExtendedService : IProductExtendedService
    {
        private readonly IBaseRepository<Product> _products;
        private readonly IBaseRepository<SupplierProduct> _supplierProducts;
        private readonly IBaseRepository<Supplier> _suppliers;

        public ProductExtendedService(IBaseRepository<Product> products,
                                      IBaseRepository<SupplierProduct> supplierProducts,
                                      IBaseRepository<Supplier> suppliers)
        {
            _products = products;
            _supplierProducts = supplierProducts;
            _suppliers = suppliers;
        }

        public IResponse<SupplierDto> GetSupplierDetails(int productId)
        {
            try
            {
                var product = _products.GetAll().FirstOrDefault(p => p.Id == productId);
                ObjectValidator<Product>.CheckIsNotNull(product);

                var supplier = _suppliers.GetAll().FirstOrDefault(s => s.SupplierProducts.Any(sp => sp.ProductId == productId));

                ObjectValidator<Supplier>.CheckIsNotNull(supplier);

                var dto = new SupplierDto
                {
                    Id = supplier.Id,
                    ProductId = product.Id,
                    Name = supplier.Name,
                    Country = supplier.Country,
                    IsActive = supplier.IsActive,
                    CountryInfo = supplier.CountryInfo,
                    CreatedAt = supplier.CreateAt
                };


                return ResponseFactory<SupplierDto>.CreateSuccessResponse(dto);
            }
            catch (Exception ex)
            {
                return ResponseFactory<SupplierDto>.CreateErrorResponse(ex);
            }
        }
    }
}