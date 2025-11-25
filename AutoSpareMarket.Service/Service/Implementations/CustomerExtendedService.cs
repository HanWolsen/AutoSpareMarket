using AutoSpareMarket.APIModels.DTO.DTOs.Customers;
using AutoSpareMarket.APIModels.Response.Helpers;
using AutoSpareMarket.APIModels.Response.Interfaces;
using AutoSpareMarket.DAL.Repository.Intarfacec;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Service.Interfaces;
using AutoSpareMarket.Validation;

namespace AutoSpareMarket.Service.Services
{
    public class CustomerExtendedService : ICustomerExtendedService
    {
        private readonly IBaseRepository<Customer> _customers;
        private readonly IBaseRepository<Product> _products;

        public CustomerExtendedService(IBaseRepository<SaleItem> saleItems,
                                       IBaseRepository<Sale> sales,
                                       IBaseRepository<Customer> customers,
                                       IBaseRepository<Product> products)
        {
            _customers = customers;
            _products = products;
        }

        public IResponse<CustomerDto> GetCustomersByProduct(int productId, int? minQuantity, DateTime? from, DateTime? to)
        {
            try
            {
                var product = _products.GetAll().FirstOrDefault(p => p.Id == productId);
                ObjectValidator<Product>.CheckIsNotNull(product);

                var customers = _customers.GetAll()
                    .Where(c => c.Sales != null && c.Sales.Any(s =>
                        s.SaleItems != null && s.SaleItems.Any(si =>
                            si.ProductId == productId &&
                            (!minQuantity.HasValue || si.Quantity >= minQuantity) &&
                            (!from.HasValue || s.CreatedAt >= from.Value) &&
                            (!to.HasValue || s.CreatedAt <= to.Value))))
                    .Select(c => new
                    {
                        Customer = c,
                        TotalQty = c.Sales
                            .Where(s => s.SaleItems != null)
                            .SelectMany(s => s.SaleItems)
                            .Where(si => si.ProductId == productId)
                            .Sum(si => si.Quantity),
                        TotalAmount = c.Sales
                            .Where(s => s.SaleItems != null)
                            .SelectMany(s => s.SaleItems)
                            .Where(si => si.ProductId == productId)
                            .Sum(si => si.Quantity * si.UnitPrice)
                    })
                    .ToList();

                var list = customers.Select(x => new CustomerDto
                {
                    Id = x.Customer.Id,
                    FirstName = x.Customer.FirstName,
                    LastName = x.Customer.LastName,
                    Email = x.Customer.Email,
                    Phone = x.Customer.Phone,
                    CreatedAt = x.Customer.CreateAt
                }).ToList();

            
                return ResponseFactory<CustomerDto>.CreateSuccessResponse(list.FirstOrDefault());
            }
            catch (Exception ex)
            {
                return ResponseFactory<CustomerDto>.CreateErrorResponse(ex);
            }
        }
    }
}