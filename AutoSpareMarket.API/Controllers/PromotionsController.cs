using AutoSpareMarket.APIModels.DTO.DTOs.Promotions;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Service.Interfaces;
using AutoSpareMarket.Service.Service.Intarfaces;
using Microsoft.AspNetCore.Mvc;

namespace AutoSpareMarket.API.Controllers
{
    [Route("api/v1/promotions")]
    public class PromotionsController : BaseApiController
    {
        private readonly IBaseService<Promotion> _baseService;
        private readonly IPromotionExtendedService _extendedService;

        public PromotionsController(IBaseService<Promotion> baseService,
                                    IPromotionExtendedService extendedService)
        {
            _baseService = baseService;
            _extendedService = extendedService;
        }

        [HttpPost]
        public ActionResult Create([FromBody] PromotionCreateDto dto)
            => HandleResponse(_baseService.Create(dto));

        [HttpGet]
        public ActionResult GetAll()
            => HandleResponse(_baseService.GetAll());

        [HttpGet("{id:int}")]
        public ActionResult GetById(int id)
            => HandleResponse(_baseService.GetById(id));

        [HttpPut("{id:int}")]
        public ActionResult Update(int id, [FromBody] PromotionUpdateDto dto)
        {
            return HandleBoolResponse(_baseService.Update(dto));
        }

        [HttpDelete("{id:int}")]
        public ActionResult Delete(int id)
            => HandleBoolResponse(_baseService.DeleteById(id));

        [HttpPost("happy-hour")]
        public ActionResult CreateHappyHour([FromBody] PromotionCreateDto dto)
            => HandleResponse(_extendedService.CreateHappyHour(dto));

        [HttpPost("product-of-day")]
        public ActionResult CreateProductOfDay([FromBody] PromotionCreateDto dto)
            => HandleResponse(_extendedService.CreateProductOfDay(dto));
    }
}