using AutoSpareMarket.DAL.Repository.Implementations;
using AutoSpareMarket.DAL.Repository.Intarfacec;
using AutoSpareMarket.Service.Service.Implementations;
using AutoSpareMarket.Service.Service.Intarfaces;

namespace AutoSpareMarket.API
{
    public static class Initializer
    {
        public static IServiceCollection InitializeRepositories(this IServiceCollection services)
        {
            services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));

            return services;
        }

        public static IServiceCollection InitializeServices(this IServiceCollection services)
        {
            services.AddScoped(typeof(IBaseService<>), typeof(BaseService<>));

            return services;
        }
    }
}
