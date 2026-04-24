using AutoSpareMarket.APIModels.DTO.BaseDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Support
{
    public class SupportDto : BaseDTO
    {
        public int Id { get; set; }
        public string Category { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
