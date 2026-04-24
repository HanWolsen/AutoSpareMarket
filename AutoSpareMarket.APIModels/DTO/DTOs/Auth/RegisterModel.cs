using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.APIModels.DTO.DTOs.Auth
{
    public class RegisterModel
    {
        [Required(ErrorMessage = "User name is required")]
        public string? username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? password { get; set; }

        [Required(ErrorMessage = "Email is required")]
        public string? email { get; set; }

        [Required(ErrorMessage = "Phone number is required")]
        public string? phonenumber { get; set; }

        [Required(ErrorMessage = "First name is required")]
        public string? firstname { get; set; }

        [Required(ErrorMessage = "Last name is required")]
        public string? lastname { get; set; }
    }
}
