using AutoSpareMarket.APIModels.DTO.DTOs.Suppliers;
using AutoSpareMarket.APIModels.Response.Interfaces;

namespace AutoSpareMarket.Service.Interfaces
{
    public interface IProductExtendedService
    {
        IResponse<SupplierDto> GetSupplierDetails(int productId);
    }
}