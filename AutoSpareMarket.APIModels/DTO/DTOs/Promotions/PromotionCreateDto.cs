using AutoSpareMarket.APIModels.DTO.BaseDTOs;
using AutoSpareMarket.Domain.Models.Enums;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Promotions
{
    public class PromotionCreateDto : BaseDTO
    {
        public string Name { get; set; } = null!;
        public PromotionType PromotionType { get; set; }
        public int ProductId { get; set; }
        public int DiscountPercent { get; set; } // 0..100
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
        public List<int>? ProductIds { get; set; }
    }
}
