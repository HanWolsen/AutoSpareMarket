using AutoSpareMarket.APIModels.DTO.BaseDTOs;
using AutoSpareMarket.APIModels.DTO.DTOs.OrderItems;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Orders
{
    public class OrderCreateDto : BaseDTO
    {
        public int SupplierId { get; set; }
        public int ManagerId { get; set; }
        public List<OrderItemCreateDto> Items { get; set; } = new();
    }
}
