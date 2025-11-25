using AutoSpareMarket.APIModels.DTO.BaseDTOs;
using AutoSpareMarket.APIModels.DTO.DTOs.OrderItems;
using AutoSpareMarket.Domain.Models.Enums;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Orders
{

    public class OrderDto : BaseDTO
    {
        public int Id { get; set; }
        public int? SupplierId { get; set; }
        public int? ManagerId { get; set; }
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
    }
}
