using AutoSpareMarket.APIModels.DTO.DTOs.Suppliers;
using AutoSpareMarket.APIModels.Response.Interfaces;

namespace AutoSpareMarket.Service.Interfaces
{
    public interface ISupplierExtendedService
    {
        IResponse<SupplierUpdateDto> AssignProduct(SupplierUpdateDto dto);
        IResponse<SupplierDto> GetSuppliersByProduct(int productId, int? minQuantity, DateTime? from, DateTime? to);
    }
}