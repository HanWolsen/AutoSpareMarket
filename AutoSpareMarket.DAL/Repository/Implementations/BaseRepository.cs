using AutoSpareMarket.DAL.Repository.Intarfacec;
using AutoSpareMarket.DAL.SqlServer.Context;
using AutoSpareMarket.Domain.Models.Abstractions;
using AutoSpareMarket.Validation;
using Microsoft.EntityFrameworkCore;

namespace AutoSpareMarket.DAL.Repository.Implementations
{
    public class BaseRepository<T> : IBaseRepository<T>
        where T : BaseEntity
    {
        protected readonly DbSet<T> _dbset;
        protected readonly AppDbContext _context;

        public BaseRepository(AppDbContext context)
        {
            ObjectValidator<AppDbContext>.CheckIsNotNull(context);

            _context = context;
            _dbset = context.Set<T>();
        }

        public void Create(T entity)
        {
            _dbset.Add(entity);
            _context.SaveChanges();
        }

        public IQueryable<T> GetAll()
        {
            return _dbset;
        }

        public T GetById(int id)
        {
            var entity = GetAll().FirstOrDefault(x => x.Id == id);
            ObjectValidator<T>.CheckIsNotNull(entity);
            return entity;
        }

        public void Update(T entity)
        {
            _dbset.Update(entity);
            _context.SaveChanges();
        }

        public void Delete(T entity)
        {
            _context.Attach(entity);
            _dbset.Remove(entity);
            _context.SaveChanges();
        }
    }
}
