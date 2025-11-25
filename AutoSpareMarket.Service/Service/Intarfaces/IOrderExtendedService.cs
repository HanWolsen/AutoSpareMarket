using AutoSpareMarket.APIModels.DTO.DTOs.OrderItems;
using AutoSpareMarket.APIModels.DTO.DTOs.Orders;
using AutoSpareMarket.APIModels.Response.Interfaces;

namespace AutoSpareMarket.Service.Interfaces
{
    public interface IOrderExtendedService
    {
        IResponse<OrderDto> CreateOrder(OrderCreateDto dto);
        IResponse<OrderDto> UpdateOrder(OrderUpdateDto dto);
        IResponse<OrderDto> UpdateStatus(OrderUpdateDto dto);
        IResponse<OrderDto> ReceiveItems(int orderId, List<OrderItemDto> items);
    }
}