using AutoSpareMarket.APIModels.DTO.BaseDTOs;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Managers
{
    public class ManagerUpdateDto : BaseDTO
    {
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
    }
}
