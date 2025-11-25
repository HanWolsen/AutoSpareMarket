using AutoSpareMarket.APIModels.DTO.BaseDTOs;
using AutoSpareMarket.APIModels.DTO.DTOs.OrderItems;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Orders
{
    public class OrderUpdateDto : BaseDTO
    {
        public OrderStatus Status { get; set; }
        public List<OrderItemUpdateDto> Items { get; set; } = new();
    }
}
