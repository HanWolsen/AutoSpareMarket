using AutoSpareMarket.Service.Service.Implementations;
using AutoSpareMarket.Service.Service.Intarfaces;
using Microsoft.AspNetCore.Mvc;

namespace AutoSpareMarket.API.Controllers
{
    [Route("api/v1/product-specs")]
    public class ProductSpecsController : BaseApiController
    {
        private readonly IProductImagesService _productSpecsService;
        public ProductSpecsController(IProductImagesService productSpecsService)
        {
            _productSpecsService = productSpecsService;
        }
    }
}
