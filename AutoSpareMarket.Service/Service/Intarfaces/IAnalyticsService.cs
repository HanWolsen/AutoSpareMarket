using AutoSpareMarket.APIModels.DTO.DTOs.Sales;
using AutoSpareMarket.APIModels.DTO.DTOs.Suppliers;
using AutoSpareMarket.APIModels.Response.Interfaces;

public interface IAnalyticsService
{
    IResponse<IEnumerable<SalesRankingItemDto>> GetTopProducts(int limit, DateTime? from, DateTime? to);
    IResponse<IEnumerable<SupplierDto>> GetCheapestSuppliers(int limit, int? productId);
    IResponse<SupplierShareDto> GetSupplierShare(int supplierId, DateTime? from, DateTime? to);
    IResponse<IEnumerable<SupplierRatingItemDto>> GetSupplierRating(string? month, DateTime? from, DateTime? to);
    IResponse<IEnumerable<SalesRankingItemDto>> GetProductRating(string? month, DateTime? from, DateTime? to);
}