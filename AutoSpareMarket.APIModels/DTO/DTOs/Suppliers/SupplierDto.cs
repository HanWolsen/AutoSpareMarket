using AutoSpareMarket.APIModels.DTO.BaseDTOs;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Suppliers
{
    public class SupplierDto : BaseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Country { get; set; } = null!;
        public bool IsActive { get; set; }
        public string? CountryInfo { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
