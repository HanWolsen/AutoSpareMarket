using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Auth
{
    public class LoginModel
    {
        [Required(ErrorMessage = "User name is required")]
        public string? username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? password { get; set; }
    }
}
