using AutoSpareMarket.APIModels.DTO.BaseDTOs;
using AutoSpareMarket.Domain.Models.Enums;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Promotions
{
    public class PromotionDto : BaseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public PromotionType PromotionType { get; set; }
        public int? ProductId { get; set; }
        public int DiscountPercent { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
    }
}
