using AutoSpareMarket.Domain.Models.Abstractions;
using AutoSpareMarket.Domain.Models.Entities.FrontEnd;

namespace AutoSpareMarket.Domain.Models.Entities
{
    public class AdminUser : ApplicationUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? MiddleName { get; set; }
    }
}
