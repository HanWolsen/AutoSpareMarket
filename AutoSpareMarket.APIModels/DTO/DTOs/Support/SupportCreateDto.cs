using AutoSpareMarket.APIModels.DTO.BaseDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Support
{
    public class SupportCreateDto : BaseDTO
    {
        public string Category { get; set; } = null!;
        public string Subject { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string Email { get; set; } = null!;
    }
}
