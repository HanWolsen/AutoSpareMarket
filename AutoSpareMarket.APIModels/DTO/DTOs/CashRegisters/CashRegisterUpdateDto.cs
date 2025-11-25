using AutoSpareMarket.APIModels.DTO.BaseDTOs;

namespace AutoSpareMarket.APIModels.DTO.DTOs.CashRegisters
{
    public class CashRegisterUpdateDto : BaseDTO
    {
        public string Name { get; set; } = null!;
        public string Location { get; set; } = null!;
    }
}
