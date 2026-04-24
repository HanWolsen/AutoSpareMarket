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
    public interface ITokenManager<Tmodel> where Tmodel : ApplicationUser
    {
        Task<IResponse<AuthResultStruct>> UpdateToken(TokenModel model);
        Task<IResponse<bool>> RevokeRefreshTokenByUserName(string username);
        Task<IResponse<bool>> RevokeAllRefreshTokens();
    }
}
