using AutoSpareMarket.APIModels.DTO.DTOs.Customers;
using AutoSpareMarket.APIModels.Response.Interfaces;

namespace AutoSpareMarket.Service.Interfaces
{
    public interface ICustomerExtendedService
    {
        IResponse<CustomerDto> GetCustomersByProduct(int productId, int? minQuantity, DateTime? from, DateTime? to);
    }
}