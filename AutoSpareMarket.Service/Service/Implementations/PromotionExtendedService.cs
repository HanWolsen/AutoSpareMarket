using AutoSpareMarket.APIModels.DTO.DTOs.Promotions;
using AutoSpareMarket.APIModels.Response.Helpers;
using AutoSpareMarket.APIModels.Response.Interfaces;
using AutoSpareMarket.DAL.Repository.Intarfacec;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Domain.Models.Enums;
using AutoSpareMarket.Service.Interfaces;
using AutoSpareMarket.Validation;

namespace AutoSpareMarket.Service.Services
{
    public class PromotionExtendedService : IPromotionExtendedService
    {
        private readonly IBaseRepository<Promotion> _promotions;
        private readonly IBaseRepository<Product> _products;

        public PromotionExtendedService(IBaseRepository<Promotion> promotions,
                                        IBaseRepository<Product> products)
        {
            _promotions = promotions;
            _products = products;
        }

        public IResponse<PromotionDto> CreateHappyHour(PromotionCreateDto dto)
        {
            try
            {
                ObjectValidator<PromotionCreateDto>.CheckIsNotNull(dto);
                if (dto.EndAt <= dto.StartAt)
                    throw new InvalidOperationException("EndAt must be later than StartAt.");

                // Если productIds null => на все продукты (не сохраняем миллион записей, можно флагом - но тут создаём для каждого)
                var productIds = dto.ProductIds ?? _products.GetAll().Select(p => p.Id).ToList();
                PromotionDto? firstDto = null;

                foreach (var pid in productIds)
                {
                    var promo = new Promotion
                    {
                        ProductId = pid,
                        Name = "Happy Hour",
                        PromotionType = PromotionType.HappyHour,
                        DiscountPercent = 20,
                        StartAt = dto.StartAt,
                        EndAt = dto.EndAt
                    };
                    _promotions.Create(promo);

                    if (firstDto == null)
                    {
                        firstDto = MapPromotion(promo);
                    }
                }

                return ResponseFactory<PromotionDto>.CreateSuccessResponse(firstDto!);
            }
            catch (Exception ex)
            {
                return ResponseFactory<PromotionDto>.CreateErrorResponse(ex);
            }
        }

        public IResponse<PromotionDto> CreateProductOfDay(PromotionCreateDto dto)
        {
            try
            {
                ObjectValidator<PromotionCreateDto>.CheckIsNotNull(dto);

                var product = _products.GetAll().FirstOrDefault(p => p.Id == dto.ProductId);
                ObjectValidator<Product>.CheckIsNotNull(product);

                var dateStart = dto.StartAt;
                var dateEnd = dateStart.AddDays(1).AddTicks(-1);

                var exists = _promotions.GetAll().Any(p =>
                    p.ProductId == dto.ProductId &&
                    p.PromotionType == PromotionType.ProductOfDay &&
                    p.StartAt.Date == dto.StartAt);
                if (exists)
                    throw new InvalidOperationException("Product already has product-of-day promotion for this date.");

                var promo = new Promotion
                {
                    ProductId = dto.ProductId,
                    Name = "Product Of The Day",
                    PromotionType = PromotionType.ProductOfDay,
                    DiscountPercent = 15,
                    StartAt = dateStart,
                    EndAt = dateEnd
                };
                _promotions.Create(promo);

                return ResponseFactory<PromotionDto>.CreateSuccessResponse(MapPromotion(promo));
            }
            catch (Exception ex)
            {
                return ResponseFactory<PromotionDto>.CreateErrorResponse(ex);
            }
        }

        private PromotionDto MapPromotion(Promotion promo)
        {
            return new PromotionDto
            {
                Id = promo.Id,
                ProductId = promo.ProductId,
                Name = promo.Name,
                PromotionType = promo.PromotionType,
                DiscountPercent = promo.DiscountPercent,
                StartAt = promo.StartAt,
                EndAt = promo.EndAt
            };
        }
    }
}