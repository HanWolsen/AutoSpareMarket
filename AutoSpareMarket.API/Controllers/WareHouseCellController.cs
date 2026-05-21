using AutoSpareMarket.APIModels.DTO.DTOs.Products;
using AutoSpareMarket.APIModels.DTO.DTOs.WarehouseCells;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Service.Interfaces;
using AutoSpareMarket.Service.Service.Intarfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoSpareMarket.API.Controllers
{
    [Route("api/v1/warehouse-cells")]

    public class WareHouseCellController : BaseApiController
    {
        private readonly IBaseService<WarehouseCell> _wareHouseService;

        public WareHouseCellController(IBaseService<WarehouseCell> wareHouseService)
        {
            _wareHouseService = wareHouseService;
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult Create([FromBody] WarehouseCellDto dto)
            => HandleResponse(_wareHouseService.Create(dto));

        [HttpPost]
        [Route("create-warehousecell")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult CreateWareHouseCell([FromBody] WarehouseCellCreateDto dto)
            => HandleResponse(_wareHouseService.Create(dto));

        [HttpGet]
        public ActionResult GetAll()
            => HandleResponse(_wareHouseService.GetAll());

        [HttpGet("{id:int}")]
        public ActionResult GetById(int id)
            => HandleResponse(_wareHouseService.GetById(id));
        [HttpPut("{id:int}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult Update(int id, [FromBody] ProductUpdateDto dto)
        {
            dto.Id = id;
            return HandleBoolResponse(_wareHouseService.Update(dto));
        }

        [HttpDelete("{id:int}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult Delete(int id)
            => HandleBoolResponse(_wareHouseService.DeleteById(id));
    }
}
