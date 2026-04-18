using AutoSpareMarket.APIModels.DTO.DTOs.Promotions;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Service.Interfaces;
using AutoSpareMarket.Service.Service.Intarfaces;
using Microsoft.AspNetCore.Authorization;
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
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult Create([FromBody] PromotionCreateDto dto)
            => HandleResponse(_baseService.Create(dto));

        [HttpGet]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult GetAll()
            => HandleResponse(_baseService.GetAll());

        [HttpGet("{id:int}")]
        public ActionResult GetById(int id)
            => HandleResponse(_baseService.GetById(id));

        [HttpPut("{id:int}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult Update(int id, [FromBody] PromotionUpdateDto dto)
        {
            return HandleBoolResponse(_baseService.Update(dto));
        }

        [HttpDelete("{id:int}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult Delete(int id)
            => HandleBoolResponse(_baseService.DeleteById(id));

        [HttpPost("happy-hour")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult CreateHappyHour([FromBody] PromotionCreateDto dto)
            => HandleResponse(_extendedService.CreateHappyHour(dto));

        [HttpPost("product-of-day")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult CreateProductOfDay([FromBody] PromotionCreateDto dto)
            => HandleResponse(_extendedService.CreateProductOfDay(dto));
    }
}