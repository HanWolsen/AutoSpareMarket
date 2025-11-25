using AutoSpareMarket.APIModels.DTO.DTOs.CashRegisters;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Service.Interfaces;
using AutoSpareMarket.Service.Service.Intarfaces;
using Microsoft.AspNetCore.Mvc;

namespace AutoSpareMarket.API.Controllers
{
    [Route("api/v1/cash-registers")]
    public class CashRegistersController : BaseApiController
    {
        private readonly IBaseService<CashRegister> _baseService;
        private readonly ICashRegisterExtendedService _extendedService;

        public CashRegistersController(IBaseService<CashRegister> baseService,
                                       ICashRegisterExtendedService extendedService)
        {
            _baseService = baseService;
            _extendedService = extendedService;
        }

        [HttpPost]
        public ActionResult Create([FromBody] CashRegisterCreateDto dto)
            => HandleResponse(_baseService.Create(dto));

        [HttpGet]
        public ActionResult GetAll()
            => HandleResponse(_baseService.GetAll());

        [HttpGet("{id:int}")]
        public ActionResult GetById(int id)
            => HandleResponse(_baseService.GetById(id));

        [HttpPut("{id:int}")]
        public ActionResult Update(int id, [FromBody] CashRegisterUpdateDto dto)
        {
            dto.Id = id;
            return HandleBoolResponse(_baseService.Update(dto));
        }

        [HttpDelete("{id:int}")]
        public ActionResult Delete(int id)
            => HandleBoolResponse(_baseService.DeleteById(id));

        [HttpGet("{id:int}/report")]
        public ActionResult Report(int id, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
            => HandleResponse(_extendedService.GetReport(id, from, to));
    }
}