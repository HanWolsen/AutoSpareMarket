using Microsoft.AspNetCore.Identity;

namespace AutoSpareMarket.Domain.Models.Abstractions
{
    public class ApplicationUser : IdentityUser<int>
    {
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
    }
}
