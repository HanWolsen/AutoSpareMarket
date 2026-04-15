using AutoSpareMarket.APIModels.Response.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AutoSpareMarket.API.Controllers
{
    [ApiController]
    public abstract class BaseApiController : ControllerBase
    {
        protected ActionResult HandleResponse<T>(IResponse<T> response)
        {
            if (response == null)
                return StatusCode(500, "Null response");

            if (!response.IsSuccess)
            {
                // Можно улучшить определением типов ошибок (NotFoundException и т.д.)
                return BadRequest(new { response.Message});
            }

            if (response.Data == null)
                return NotFound();

            return Ok(response.Data);
        }

        protected ActionResult HandleResponse<T>(Task<IResponse<T>> response)
        {
            var responseResult = response.Result;

            if (responseResult == null)
                return StatusCode(500, "Null response");

            if (!responseResult.IsSuccess)
            {
                // Можно улучшить определением типов ошибок (NotFoundException и т.д.)
                return BadRequest(new { responseResult.Message });
            }

            if (responseResult.Data == null)
                return NotFound();

            return Ok(responseResult.Data);
        }

        protected ActionResult HandleBoolResponse(IResponse<bool> response)
        {
            if (response == null)
                return StatusCode(500, "Null response");
            if (!response.IsSuccess)
                return BadRequest(new { response.Message});

            if (!response.Data)
                return BadRequest(new { message = "Operation failed" });

            return NoContent();
        }
    }
}
