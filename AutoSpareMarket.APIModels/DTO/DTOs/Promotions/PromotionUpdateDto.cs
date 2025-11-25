using AutoSpareMarket.APIModels.DTO.BaseDTOs;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Promotions
{
    public class PromotionUpdateDto : BaseDTO
    {
        public string Name { get; set; } = null!;
        public int DiscountPercent { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
    }
}
