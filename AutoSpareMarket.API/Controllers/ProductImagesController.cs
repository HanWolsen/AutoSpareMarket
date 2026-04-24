using AutoSpareMarket.Service.Service.Intarfaces;
using Microsoft.AspNetCore.Mvc;


namespace AutoSpareMarket.API.Controllers
{

    //[8.2] Создать контроллер для сущности ProductImages с помощью шаблона API Controller with actions,
    //using Entity Framework, указать имя контроллера ProductImagesController и модель данных ProductImages
    [Route("api/v1/products_images")]
    public class ProductImagesController : BaseApiController
    {
        private readonly IProductImagesService _productImagesService;
        public ProductImagesController(IProductImagesService productImagesService)
        {
            _productImagesService = productImagesService;
        }

        //[8.3] Добавить метод для получения изображения продукта по его идентификатору
        //(или любой другой метод который нужен в фронте)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var productImage = await _productImagesService.GetProductImageByPrdouctIdAsync(id);
            if (productImage == null)
            {
                return NotFound();
            }
            return Ok(productImage.ImageUrl);
        }
    }
}
