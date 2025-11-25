using AutoSpareMarket.APIModels.DTO.DTOs.Products;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Service.Interfaces;
using AutoSpareMarket.Service.Service.Intarfaces;
using Microsoft.AspNetCore.Mvc;

namespace AutoSpareMarket.API.Controllers
{
    [Route("api/v1/products")]
    public class ProductsController : BaseApiController
    {
        private readonly IBaseService<Product> _baseService;
        private readonly IProductExtendedService _extendedService;

        public ProductsController(IBaseService<Product> baseService,
                                  IProductExtendedService extendedService)
        {
            _baseService = baseService;
            _extendedService = extendedService;
        }

        [HttpPost]
        public ActionResult Create([FromBody] ProductCreateDto dto)
            => HandleResponse(_baseService.Create(dto));

        [HttpGet]
        public ActionResult GetAll()
            => HandleResponse(_baseService.GetAll());

        [HttpGet("{id:int}")]
        public ActionResult GetById(int id)
            => HandleResponse(_baseService.GetById(id));

        [HttpPut("{id:int}")]
        public ActionResult Update(int id, [FromBody] ProductUpdateDto dto)
        {
            dto.Id = id;
            return HandleBoolResponse(_baseService.Update(dto));
        }

        [HttpDelete("{id:int}")]
        public ActionResult Delete(int id)
            => HandleBoolResponse(_baseService.DeleteById(id));

        [HttpGet("{id:int}/supplier-details")]
        public ActionResult SupplierDetails(int id)
            => HandleResponse(_extendedService.GetSupplierDetails(id));
    }
}