using AutoSpareMarket.Domain.Models.Entities.FrontEnd;

namespace AutoSpareMarket.Service.Service.Intarfaces
{

    // [7.1] Реализовать интерфейс для сервиса, который будет работать с сущностью.
    // В данном случае, сервис будет предоставлять методы для получения информации о изображениях продуктов.
    public interface IProductImagesService :  IBaseGuidService<ProductImages>
    {
        public Task<ProductImages> GetProductImageByPrdouctIdAsync(int id);
    }
}
