using AutoSpareMarket.APIModels.DTO.DTOs.Suppliers;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Service.Interfaces;
using AutoSpareMarket.Service.Service.Intarfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoSpareMarket.API.Controllers
{
    [Route("api/v1/suppliers")]
    public class SuppliersController : BaseApiController
    {
        private readonly IBaseService<Supplier> _supplierService;
        private readonly ISupplierExtendedService _extendedService;
        private readonly IBaseService<SupplierProduct> _supplierProductBase;

        // SupplierController(...) - конструктор
        // Конструктор - это метод который вызываеться при создании обьекта класса
        public SuppliersController(IBaseService<Supplier> supplierService,
                                   ISupplierExtendedService extendedService,
                                   IBaseService<SupplierProduct> supplierProductBase)
        {
            _supplierService = supplierService;
            _extendedService = extendedService;
            _supplierProductBase = supplierProductBase;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="dto"></param>
        /// <returns></returns>
        //[Атрибут]
        [HttpPut("{id:int}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        // public - модификатор доступа
        // ActionResult - возвращаемый тип данных (returns)
        // Update - наименование метода
        // (int id, [FromBody] SupplierUpdateDto dto) - параметры метода (param)
        public ActionResult Update(int id, [FromBody] SupplierUpdateDto dto)
        {
            dto.Id = id;
            return HandleBoolResponse(_supplierService.Update(dto));

        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult Create([FromBody] SupplierCreateDto dto)
            => HandleResponse(_supplierService.Create(dto));

        [HttpGet]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult GetAll()
            => HandleResponse(_supplierService.GetAll());

        [HttpGet("{id:int}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult GetById(int id)
            => HandleResponse(_supplierService.GetById(id));

        
        

        [HttpDelete("{id:int}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult Delete(int id)
            => HandleBoolResponse(_supplierService.DeleteById(id));

        [HttpPost("assign-product")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult AssignProduct([FromBody] SupplierUpdateDto dto)
            => HandleResponse(_extendedService.AssignProduct(dto));

        [HttpGet("by-product/{productId:int}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult GetSuppliersByProduct(int productId, [FromQuery] int? minQuantity, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
            => HandleResponse(_extendedService.GetSuppliersByProduct(productId, minQuantity, from, to));
    }
}