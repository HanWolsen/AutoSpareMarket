using AutoSpareMarket.APIModels.DTO.DTOs.Customers;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Service.Interfaces;
using AutoSpareMarket.Service.Service.Intarfaces;
using Microsoft.AspNetCore.Mvc;

namespace AutoSpareMarket.API.Controllers
{
    [Route("api/v1/customers")]
    public class CustomersController : BaseApiController
    {
        private readonly IBaseService<Customer> _baseService;
        private readonly ICustomerExtendedService _extendedService;

        public CustomersController(IBaseService<Customer> baseService,
                                   ICustomerExtendedService extendedService)
        {
            _baseService = baseService;
            _extendedService = extendedService;
        }

        [HttpPost]
        public ActionResult Create([FromBody] CustomerCreateDto dto)
            => HandleResponse(_baseService.Create(dto));

        [HttpGet]
        public ActionResult GetAll()
            => HandleResponse(_baseService.GetAll());

        [HttpGet("{id:int}")]
        public ActionResult GetById(int id)
            => HandleResponse(_baseService.GetById(id));

        [HttpPut("{id:int}")]
        public ActionResult Update(int id, [FromBody] CustomerUpdateDto dto)
        {
            dto.Id = id;
            return HandleBoolResponse(_baseService.Update(dto));
        }

        [HttpDelete("{id:int}")]
        public ActionResult Delete(int id)
            => HandleBoolResponse(_baseService.DeleteById(id));

        [HttpGet("by-product/{productId:int}")]
        public ActionResult GetCustomersByProduct(int productId, [FromQuery] int? minQuantity, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
            => HandleResponse(_extendedService.GetCustomersByProduct(productId, minQuantity, from, to));
    }
}