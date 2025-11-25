using AutoSpareMarket.APIModels.DTO.DTOs.Suppliers;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Service.Interfaces;
using AutoSpareMarket.Service.Service.Intarfaces;
using Microsoft.AspNetCore.Mvc;

namespace AutoSpareMarket.API.Controllers
{
    [Route("api/v1/suppliers")]
    public class SuppliersController : BaseApiController
    {
        private readonly IBaseService<Supplier> _supplierService;
        private readonly ISupplierExtendedService _extendedService;
        private readonly IBaseService<SupplierProduct> _supplierProductBase;

        public SuppliersController(IBaseService<Supplier> supplierService,
                                   ISupplierExtendedService extendedService,
                                   IBaseService<SupplierProduct> supplierProductBase)
        {
            _supplierService = supplierService;
            _extendedService = extendedService;
            _supplierProductBase = supplierProductBase;
        }

        [HttpPost]
        public ActionResult Create([FromBody] SupplierCreateDto dto)
            => HandleResponse(_supplierService.Create(dto));

        [HttpGet]
        public ActionResult GetAll()
            => HandleResponse(_supplierService.GetAll());

        [HttpGet("{id:int}")]
        public ActionResult GetById(int id)
            => HandleResponse(_supplierService.GetById(id));

        [HttpPut("{id:int}")]
        public ActionResult Update(int id, [FromBody] SupplierUpdateDto dto)
        {
            dto.Id = id;
            return HandleBoolResponse(_supplierService.Update(dto));
        }

        [HttpDelete("{id:int}")]
        public ActionResult Delete(int id)
            => HandleBoolResponse(_supplierService.DeleteById(id));

        [HttpPost("assign-product")]
        public ActionResult AssignProduct([FromBody] SupplierUpdateDto dto)
            => HandleResponse(_extendedService.AssignProduct(dto));

        [HttpGet("by-product/{productId:int}")]
        public ActionResult GetSuppliersByProduct(int productId, [FromQuery] int? minQuantity, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
            => HandleResponse(_extendedService.GetSuppliersByProduct(productId, minQuantity, from, to));
    }
}