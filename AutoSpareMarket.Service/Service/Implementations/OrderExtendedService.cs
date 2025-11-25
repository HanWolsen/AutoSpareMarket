using AutoSpareMarket.APIModels.DTO.DTOs.OrderItems;
using AutoSpareMarket.APIModels.DTO.DTOs.Orders;
using AutoSpareMarket.APIModels.Response.Helpers;
using AutoSpareMarket.APIModels.Response.Interfaces;
using AutoSpareMarket.DAL.Repository.Intarfacec;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Domain.Models.Enums;
using AutoSpareMarket.Service.Helpers.Maping;
using AutoSpareMarket.Service.Interfaces;
using AutoSpareMarket.Validation;

namespace AutoSpareMarket.Service.Services
{
    public class OrderExtendedService : IOrderExtendedService
    {
        private readonly IBaseRepository<Order> _orders;
        private readonly IBaseRepository<OrderItem> _orderItems;
        private readonly IBaseRepository<Product> _products;
        private readonly IBaseRepository<SupplierProduct> _supplierProducts;
        private readonly IBaseRepository<WarehoudeCell> _warehouseCells;

        public OrderExtendedService(IBaseRepository<Order> orders,
                                    IBaseRepository<OrderItem> orderItems,
                                    IBaseRepository<Product> products,
                                    IBaseRepository<SupplierProduct> supplierProducts,
                                    IBaseRepository<WarehoudeCell> warehouseCells)
        {
            _orders = orders;
            _orderItems = orderItems;
            _products = products;
            _supplierProducts = supplierProducts;
            _warehouseCells = warehouseCells;
        }

        public IResponse<OrderDto> CreateOrder(OrderCreateDto dto)
        {
            try
            {
                ObjectValidator<OrderCreateDto>.CheckIsNotNull(dto);
                if (dto.Items == null || dto.Items.Count == 0)
                    throw new InvalidOperationException("Order must have items.");

                var order = MapperHelper<OrderCreateDto, Order>.Map(dto);
                _orders.Create(order);

                decimal total = 0m;
                foreach (var itemDto in dto.Items)
                {
                    var product = _products.GetAll().FirstOrDefault(p => p.Id == itemDto.ProductId);
                    if (product == null)
                    {
                        // создаём новый продукт с временной ячейкой (нужно существование ячейки)
                        var defaultCell = _warehouseCells.GetAll().FirstOrDefault();
                        if (defaultCell == null)
                            throw new InvalidOperationException("No warehouse cell found to assign new product.");
                        product = new Product
                        {
                            Name = "New Product " + itemDto.ProductId,
                            Description = "",
                            WarehouseCellId = defaultCell.Id,
                            DateAdd = DateTime.UtcNow
                        };
                        _products.Create(product);
                    }

                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,
                        ProductId = product.Id,
                        Quantity = itemDto.Quantity,
                        UnitPrice = itemDto.UnitPrice,
                        ReceivedQuantity = 0
                    };
                    _orderItems.Create(orderItem);
                    total += orderItem.Quantity * orderItem.UnitPrice;
                }

                order.TotalAmount = (int)total;
                _orders.Update(order);

                return ResponseFactory<OrderDto>.CreateSuccessResponse(MapOrder(order));
            }
            catch (Exception ex)
            {
                return ResponseFactory<OrderDto>.CreateErrorResponse(ex);
            }
        }

        public IResponse<OrderDto> UpdateOrder(OrderUpdateDto dto)
        {
            try
            {
                ObjectValidator<OrderUpdateDto>.CheckIsNotNull(dto);

                var order = _orders.GetAll().FirstOrDefault(o => o.Id == dto.Id);
                ObjectValidator<Order>.CheckIsNotNull(order);

                order.Status = dto.Status;
                _orders.Update(order);

                // Обновление существующих строк
                var existingItems = _orderItems.GetAll().Where(oi => oi.OrderId == order.Id).ToList();
                foreach (var upd in dto.Items)
                {
                    var item = existingItems.FirstOrDefault(i => i.Id == upd.Id);
                    if (item == null) continue;
                    item.ProductId = upd.ProductId;
                    item.Quantity = upd.Quantity;
                    item.UnitPrice = upd.UnitPrice;
                    item.ReceivedQuantity = upd.ReceivedQuantity;
                    _orderItems.Update(item);
                }

                order.TotalAmount = (int)_orderItems.GetAll()
                                    .Where(i => i.OrderId == order.Id)
                                    .Sum(i => i.Quantity * i.UnitPrice);
                _orders.Update(order);

                return ResponseFactory<OrderDto>.CreateSuccessResponse(MapOrder(order));
            }
            catch (Exception ex)
            {
                return ResponseFactory<OrderDto>.CreateErrorResponse(ex);
            }
        }

        public IResponse<OrderDto> UpdateStatus(OrderUpdateDto dto)
        {
            try
            {
                var order = _orders.GetAll().FirstOrDefault(o => o.Id == dto.Id);
                ObjectValidator<Order>.CheckIsNotNull(order);
                order.Status = dto.Status;
                _orders.Update(order);
                return ResponseFactory<OrderDto>.CreateSuccessResponse(MapOrder(order));
            }
            catch (Exception ex)
            {
                return ResponseFactory<OrderDto>.CreateErrorResponse(ex);
            }
        }

        public IResponse<OrderDto> ReceiveItems(int orderId, List<OrderItemDto> items)
        {
            try
            {
                var order = _orders.GetAll().FirstOrDefault(o => o.Id == orderId);
                ObjectValidator<Order>.CheckIsNotNull(order);

                foreach (var ri in items)
                {
                    var item = _orderItems.GetAll().FirstOrDefault(i => i.Id == ri.Id && i.OrderId == orderId);
                    if (item == null)
                        throw new InvalidOperationException($"Order item {ri.Id} not found.");
                    if (ri.ReceivedQuantity < 0 || ri.ReceivedQuantity + item.ReceivedQuantity > item.Quantity)
                        throw new InvalidOperationException("Invalid received quantity.");

                    item.ReceivedQuantity += ri.ReceivedQuantity;
                    _orderItems.Update(item);

                    // увеличиваем складской остаток
                    var product = _products.GetAll().First(p => p.Id == item.ProductId);
                    var cell = _warehouseCells.GetAll().First(c => c.Id == product.WarehouseCellId);
                    cell.Quantity += ri.ReceivedQuantity;
                    _warehouseCells.Update(cell);
                }

                // если всё получено - статус Completed
                bool allReceived = _orderItems.GetAll()
                                    .Where(i => i.OrderId == orderId)
                                    .All(i => i.ReceivedQuantity == i.Quantity);
                if (allReceived && order.Status != OrderStatus.Completed)
                {
                    order.Status = OrderStatus.Completed;
                    _orders.Update(order);
                }

                return ResponseFactory<OrderDto>.CreateSuccessResponse(MapOrder(order));
            }
            catch (Exception ex)
            {
                return ResponseFactory<OrderDto>.CreateErrorResponse(ex);
            }
        }

        private OrderDto MapOrder(Order order)
        {
            var itemDtos = _orderItems.GetAll()
                            .Where(i => i.OrderId == order.Id)
                            .Select(i => new OrderItemDto
                            {
                                Id = i.Id,
                                ProductId = i.ProductId,
                                Quantity = i.Quantity,
                                ReceivedQuantity = i.ReceivedQuantity,
                                UnitPrice = i.UnitPrice
                            }).ToList();

            return new OrderDto
            {
                Id = order.Id,
                SupplierId = order.SuplierId,
                ManagerId = order.ManagerId,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                CreatedAt = order.CreatedAt,
                Items = itemDtos
            };
        }
    }
}