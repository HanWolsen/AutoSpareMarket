namespace AutoSpareMarket.APIModels.DTO.BaseDTOs
{
    public abstract class BaseDTO
    {

    }

    public class PagedResult<T>
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages => (int)Math.Ceiling(TotalItems / (double)PageSize);
        public IEnumerable<T> Items { get; set; } = Enumerable.Empty<T>();
    }
    public class DateRangeQuery
    {
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
    }
}
