using AutoSpareMarket.Domain.Models.Abstractions;

namespace AutoSpareMarket.DAL.Repository.Interfaces
{
    public interface IBaseGuidRepository<T> where T : BaseEntity<Guid>
    {
        public void Create(T entity);

        public IQueryable<T> GetAll();

        public T GetById(Guid id);

        public void Update(T entity);

        public void Delete(T entity);
    }
}
