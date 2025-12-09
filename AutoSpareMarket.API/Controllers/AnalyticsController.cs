/*using Microsoft.AspNetCore.Mvc;

namespace AutoSpareMarket.API.Controllers
{
    [Route("api/v1/analytics")]
    public class AnalyticsController : BaseApiController
    {
        private readonly IAnalyticsService _analyticsService;

        public AnalyticsController(IAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        [HttpGet("top/products")]
        public ActionResult TopProducts([FromQuery] int limit = 10, [FromQuery] DateTime? from = null, [FromQuery] DateTime? to = null)
            => HandleResponse(_analyticsService.GetTopProducts(limit, from, to));

        [HttpGet("top/cheapest-suppliers")]
        public ActionResult CheapestSuppliers([FromQuery] int limit = 10, [FromQuery] int? productId = null)
            => HandleResponse(_analyticsService.GetCheapestSuppliers(limit, productId));

        [HttpGet("suppliers/{supplierId:int}/share")]
        public ActionResult SupplierShare(int supplierId, [FromQuery] DateTime? from = null, [FromQuery] DateTime? to = null)
            => HandleResponse(_analyticsService.GetSupplierShare(supplierId, from, to));

        [HttpGet("rating/suppliers")]
        public ActionResult SupplierRating([FromQuery] string? month, [FromQuery] DateTime? from = null, [FromQuery] DateTime? to = null)
            => HandleResponse(_analyticsService.GetSupplierRating(month, from, to));

        [HttpGet("rating/products")]
        public ActionResult ProductRating([FromQuery] string? month, [FromQuery] DateTime? from = null, [FromQuery] DateTime? to = null)
            => HandleResponse(_analyticsService.GetProductRating(month, from, to));
    }
}*/