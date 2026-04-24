using AutoSpareMarket.APIModels.DTO.DTOs.Support;
using AutoSpareMarket.Domain.Models.Entities.FrontEnd;
using AutoSpareMarket.Service.Service.Intarfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoSpareMarket.API.Controllers
{
    [Route("api/v1/support-request")]
    public class SupportRequestController : BaseApiController
    {
        private readonly IBaseGuidService<SupportRequests> _supportRequestService;

        public SupportRequestController(IBaseGuidService<SupportRequests> supportRequestService)
        {
            _supportRequestService = supportRequestService;
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public ActionResult Create([FromBody] SupportCreateDto dto)
            => HandleResponse(_supportRequestService.Create(dto));
    }
}
