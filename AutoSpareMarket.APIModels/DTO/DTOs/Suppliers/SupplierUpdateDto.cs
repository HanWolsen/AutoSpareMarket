using AutoSpareMarket.APIModels.DTO.BaseDTOs;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Suppliers
{
    public class SupplierUpdateDto : BaseDTO
    {
        public int Id { get; set; }
        public int? ProductId { get; set; }
        public string Name { get; set; } = null!;
        public string Country { get; set; } = null!;
        public bool IsActive { get; set; }
        public string? CountryInfo { get; set; }
    }
}
