using AutoSpareMarket.APIModels.DTO.DTOs.Support;
using AutoSpareMarket.Domain.Models.Entities.FrontEnd;
using AutoSpareMarket.Service.Service.Intarfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoSpareMarket.API.Controllers
{
    [Route("api/v1/store-user")]
    public class StoreUserController : BaseApiController
    {
        private readonly IBaseGuidService<StoreUsers> _storeUserService;

        public StoreUserController(IBaseGuidService<StoreUsers> storeUserService)
        {
            _storeUserService = storeUserService;
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult Create([FromBody] SupportCreateDto dto)
            => HandleResponse(_storeUserService.Create(dto));
    }
}
