using AutoMapper;

namespace AutoSpareMarket.Service.Helpers.Maping
{
    internal class AutoMapperConfig<T,Tmodel>
    {
        public static IMapper Initialize()
        {
            var mapperConfiguration = new MapperConfiguration(cfg => 
            {
                cfg.CreateMap<T, Tmodel>();
            });

            return mapperConfiguration.CreateMapper();
        }
    }
}
