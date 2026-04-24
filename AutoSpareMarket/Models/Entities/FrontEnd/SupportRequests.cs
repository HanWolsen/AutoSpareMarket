using AutoSpareMarket.Domain.Models.Abstractions;

namespace AutoSpareMarket.Domain.Models.Entities.FrontEnd
{
    public class SupportRequests : BaseEntity<Guid>
    {
        public string Category { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
