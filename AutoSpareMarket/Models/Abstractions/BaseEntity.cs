using AutoSpareMarket.Domain.Models.Entities;

namespace AutoSpareMarket.Domain.Models.Abstractions
{
    public abstract class BaseEntity<T>
    {
        public T Id { get; set; }
    }
}
