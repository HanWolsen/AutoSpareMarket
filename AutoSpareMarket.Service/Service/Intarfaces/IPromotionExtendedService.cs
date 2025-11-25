using AutoSpareMarket.APIModels.DTO.DTOs.Promotions;
using AutoSpareMarket.APIModels.Response.Interfaces;

namespace AutoSpareMarket.Service.Interfaces
{
    public interface IPromotionExtendedService
    {
        IResponse<PromotionDto> CreateHappyHour(PromotionCreateDto dto);
        IResponse<PromotionDto> CreateProductOfDay(PromotionCreateDto dto);
    }
}
