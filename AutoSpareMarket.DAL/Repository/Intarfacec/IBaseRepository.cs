using AutoSpareMarket.Domain.Models.Abstractions;

namespace AutoSpareMarket.DAL.Repository.Intarfacec
{
    public interface IBaseRepository<T> where T : BaseEntity
    {
        public void Create(T entity);

        public IQueryable<T> GetAll();

        public T GetById(int id);

        public void Update(T entity);

        public void Delete(T entity);
    }
}
