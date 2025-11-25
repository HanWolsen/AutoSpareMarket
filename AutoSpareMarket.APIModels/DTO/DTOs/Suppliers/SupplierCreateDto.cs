using AutoSpareMarket.APIModels.DTO.BaseDTOs;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Suppliers
{
    public class SupplierCreateDto : BaseDTO
    {
        public string Name { get; set; } = null!;
        public string Country { get; set; } = null!;
        public bool IsActive { get; set; } = true;
        public string? CountryInfo { get; set; }
    }
}
