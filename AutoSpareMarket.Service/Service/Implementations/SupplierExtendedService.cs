using AutoSpareMarket.APIModels.DTO.DTOs.Suppliers;
using AutoSpareMarket.APIModels.Response.Helpers;
using AutoSpareMarket.APIModels.Response.Interfaces;
using AutoSpareMarket.DAL.Repository.Intarfacec;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Service.Interfaces;
using AutoSpareMarket.Validation;

namespace AutoSpareMarket.Service.Services
{
    public class SupplierExtendedService : ISupplierExtendedService
    {
        private readonly IBaseRepository<SupplierProduct> _supplierProducts;
        private readonly IBaseRepository<Supplier> _suppliers;
        private readonly IBaseRepository<Product> _products;

        public SupplierExtendedService(IBaseRepository<SupplierProduct> supplierProducts,
                                       IBaseRepository<Supplier> suppliers,
                                       IBaseRepository<Product> products,
                                       IBaseRepository<SaleItem> saleItems,
                                       IBaseRepository<Sale> sales)
        {
            _supplierProducts = supplierProducts;
            _suppliers = suppliers;
            _products = products;
        }

        public IResponse<SupplierUpdateDto> AssignProduct(SupplierUpdateDto dto)
        {
            try
            {
                ObjectValidator<SupplierUpdateDto>.CheckIsNotNull(dto);

                var supplier = _suppliers.GetAll().FirstOrDefault(s => s.Id == dto.Id);
                ObjectValidator<Supplier>.CheckIsNotNull(supplier);

                var product = _products.GetAll().FirstOrDefault(p => p.Id == dto.ProductId);
                ObjectValidator<Product>.CheckIsNotNull(product);

                var exists = _supplierProducts.GetAll()
                                .Any(sp => sp.SupplierId == dto.Id && sp.ProductId == dto.ProductId);
                if (exists)
                    throw new InvalidOperationException("Supplier already assigned to product.");

                var entity = new SupplierProduct
                {
                    ProductId = dto.ProductId,
                    SupplierId = dto.Id,
                };
                _supplierProducts.Create(entity);

                var result = new SupplierUpdateDto
                {
                    Id = supplier.Id,
                    ProductId = entity.ProductId,
                    Name = supplier.Name,
                    Country = supplier.Country,
                    CountryInfo = supplier.CountryInfo,
                    IsActive = supplier.IsActive,

                };
                return ResponseFactory<SupplierUpdateDto>.CreateSuccessResponse(result);
            }
            catch (Exception ex)
            {
                return ResponseFactory<SupplierUpdateDto>.CreateErrorResponse(ex);
            }
        }

        public IResponse<SupplierDto> GetSuppliersByProduct(int productId, int? minQuantity, DateTime? from, DateTime? to)
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