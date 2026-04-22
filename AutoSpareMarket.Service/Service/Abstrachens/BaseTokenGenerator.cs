using AutoSpareMarket.Domain.Models.Abstractions;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.Service.Service.Abstrachens
{
    public abstract class BaseTokenGenerator<Tmodel> where Tmodel : ApplicationUser
    {
        public BaseTokenGenerator()
        {

        }

        /// <summary>
        /// Создаёт токен доступа(accessToken) из представленного списка утверждений(claims) от пользователя
        /// </summary>
        /// <param name="claims">Список утверждений(claims) пользователя</param>
        /// <returns>Токен доступа(accessToken)</returns>
        protected abstract JwtSecurityToken GenerateToken(List<Claim> claims);
        /// <summary>
        /// Генерирует токен обновления(refreshToken)
        /// </summary>
        /// <returns>Токен обновления(refreshToken)</returns>
        protected abstract string GenerateRefreshToken();
        /// <summary>
        /// Возвращает основные утверждения(claims) из истёкшего JWT токена доступа(accessToken)
        /// </summary>
        /// <param name="accessToken">Токен доступа(accessToken)</param>
        /// <returns>Основные утверждения(claims) из токена</returns>
        protected abstract ClaimsPrincipal GetClaimsPrincipal(string? accessToken);
        protected abstract SecurityKey GetSymmetricSecurityKey();
    }
}
