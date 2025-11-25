using AutoSpareMarket.Domain.Models.Abstractions;

namespace AutoSpareMarket.Service.Helpers.Maping
{
    internal class MapperHelper<Tmodel, T> 
       where Tmodel : class
       where T : BaseEntity
    {
        public static T Map(Tmodel model)
        {
            var mapper = AutoMapperConfig<Tmodel, T>.Initialize();

            return mapper.Map<T>(model);
        }

        public static IEnumerable<T> Map(IEnumerable<Tmodel> model)
        {
            var mapper = AutoMapperConfig<Tmodel, T>.Initialize();

            return mapper.Map<IEnumerable<T>>(model);
        }
    }
}
