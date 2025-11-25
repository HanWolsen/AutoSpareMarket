using AutoSpareMarket.APIModels.DTO.DTOs.OrderItems;
using AutoSpareMarket.APIModels.DTO.DTOs.Orders;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Service.Interfaces;
using AutoSpareMarket.Service.Service.Intarfaces;
using Microsoft.AspNetCore.Mvc;

namespace AutoSpareMarket.API.Controllers
{
    [Route("api/v1/orders")]
    public class OrdersController : BaseApiController
    {
        private readonly IBaseService<Order> _baseService;
        private readonly IOrderExtendedService _extendedService;

        public OrdersController(IBaseService<Order> baseService,
                                IOrderExtendedService extendedService)
        {
            _baseService = baseService;
            _extendedService = extendedService;
        }

        [HttpPost]
        public ActionResult Create([FromBody] OrderCreateDto dto)
            => HandleResponse(_extendedService.CreateOrder(dto));

        [HttpGet]
        public ActionResult GetAll()
            => HandleResponse(_baseService.GetAll());

        [HttpGet("{id:int}")]
        public ActionResult GetById(int id)
            => HandleResponse(_baseService.GetById(id));

        [HttpPut("{id:int}")]
        public ActionResult Update(int id, [FromBody] OrderUpdateDto dto)
        {
            dto.Id = id;
            return HandleResponse(_extendedService.UpdateOrder(dto));
        }

        [HttpPatch("{id:int}/status")]
        public ActionResult UpdateStatus(int id, [FromBody] OrderUpdateDto dto)
        {
            dto.Id = id;
            return HandleResponse(_extendedService.UpdateStatus(dto));
        }

        [HttpDelete("{id:int}")]
        public ActionResult Delete(int id)
            => HandleBoolResponse(_baseService.DeleteById(id));

        [HttpPost("{id:int}/receive-items")]
        public ActionResult ReceiveItems(int id, [FromBody] List<OrderItemDto> items)
            => HandleResponse(_extendedService.ReceiveItems(id, items));
    }
}