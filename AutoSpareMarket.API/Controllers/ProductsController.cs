using AutoSpareMarket.APIModels.DTO.DTOs.Products;
using AutoSpareMarket.APIModels.DTO.DTOs.WarehouseCells;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Service.Interfaces;
using AutoSpareMarket.Service.Service.Intarfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoSpareMarket.API.Controllers
{
    [Route("api/v1/products")]
    public class ProductsController : BaseApiController
    {
        private readonly IBaseService<Product> _baseService;
        private readonly IProductExtendedService _extendedService;
        private readonly IBaseService<WarehouseCell> _wareHouseService;

        public ProductsController(IBaseService<Product> baseService,
                                  IProductExtendedService extendedService,
                                  IBaseService<WarehouseCell> wareHouseService)
        {
            _baseService = baseService;
            _extendedService = extendedService;
            _wareHouseService = wareHouseService;
        }

        [HttpPost]
        public ActionResult Create([FromBody] ProductCreateDto dto)
        {
            ProductDto productDto = new ProductDto
            {
                Name = dto.Name,
                Description = dto.Description,
                Category = dto.Category,
                DateAdd = DateTime.Now,
                Price = dto.Price,
                WarehouseCellId = int.Parse(dto.Cell),
                Cell = dto.Cell
            };
            return HandleResponse(_baseService.Create(productDto));
        }

        [HttpPost]
        [Route("create-warehousecell")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult CreateWareHouseCell([FromBody] WarehouseCellCreateDto dto)
            => HandleResponse(_wareHouseService.Create(dto));

        [HttpGet]
        public ActionResult GetAll()
            => HandleResponse(_baseService.GetAll());

        [HttpGet("{id:int}")]
        public ActionResult GetById(int id)
            => HandleResponse(_baseService.GetById(id));

        [HttpGet]
        [Route("get-by-warehousecell/{id:int}")]
        public ActionResult GetByWarehouseCellId(int id)
       => HandleResponse(_extendedService.GetProductNameByWareHouseCellId(id));

        [HttpPut("{id:int}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult Update(int id, [FromBody] ProductUpdateDto dto)
        {
            ProductDto productDto = new ProductDto
            {
                Name = dto.Name,
                Description = dto.Description,
                Category = dto.Category,
                DateAdd = DateTime.Now,
                Price = dto.Price,
                WarehouseCellId = int.Parse(dto.Cell),
                Cell = dto.Cell
            };
            dto.Id = id;
            return HandleBoolResponse(_baseService.Update(productDto));
        }

        [HttpDelete("{id:int}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult Delete(int id)
            => HandleBoolResponse(_baseService.DeleteById(id));

        [HttpGet("{id:int}/supplier-details")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult SupplierDetails(int id)
            => HandleResponse(_extendedService.GetSupplierDetails(id));
    }
}