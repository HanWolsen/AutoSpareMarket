using AutoSpareMarket.APIModels.DTO.DTOs.Auth;
using AutoSpareMarket.APIModels.Response.Interfaces;
using AutoSpareMarket.Domain.Models.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.Service.Service.Intarfaces
{
    public interface IAuthManager<Tmodel> where Tmodel : ApplicationUser
    {
        Task<IResponse<AuthResultStruct>> Login(LoginModel model);
        Task<IResponse<UserDto>> Register(RegisterModel model);
    }
}
