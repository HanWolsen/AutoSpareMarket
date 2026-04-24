using AutoSpareMarket.APIModels.DTO.DTOs.Auth;
using AutoSpareMarket.APIModels.Response.Helpers;
using AutoSpareMarket.APIModels.Response.Interfaces;
using AutoSpareMarket.Domain.Models.Abstractions;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Service.Helpers.Maping;
using AutoSpareMarket.Service.Service.Abstrachens;
using AutoSpareMarket.Service.Service.Intarfaces;
using AutoSpareMarket.Validation;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace AutoSpareMarket.Service.Service.Implementations
{
    public class AuthManager<T> : BaseTokenGenerator<T>, IAuthManager<T>, ITokenManager<T>
        where T : ApplicationUser
    {
        private readonly UserManager<AdminUser> _userManager;
        private readonly IConfiguration _configuration;

        /// <summary>
        /// Инициализирует новый экземпляр менеджера аутентификации с необходимыми зависимостями
        /// </summary>
        /// <param name="userManager">Менеджер пользователя для управления операциями с пользователями</param>
        /// <param name="configuration">Конфигурация приложения, содержащая настройки аутентификации</param>
        public AuthManager(UserManager<AdminUser> userManager, IConfiguration configuration)
        {
            ObjectValidator<UserManager<AdminUser>>.CheckIsNotNull(userManager);
            ObjectValidator<IConfiguration>.CheckIsNotNull(configuration);
            _userManager = userManager;
            _configuration = configuration;
        }
        /// <summary>
        /// Выполняет аутентификацию пользователя по логину и паролю с выдачей токенов доступа и обновления
        /// </summary>
        /// <param name="model">Модель входа, содержащая имя пользователя и пароль</param>
        /// <returns>Объект ответа с результатом аутентификации, содержащий accessToken, refreshToken и срок действия токена</returns>
        /// <exception cref="InvalidOperationException">Возникает при неверном имени пользователя, неправильном пароле или некорректной конфигурации токена обновления</exception>
        public async Task<IResponse<AuthResultStruct>> Login(LoginModel model)
        {
            try
            {
                ObjectValidator<LoginModel>.CheckIsNotNull(model);

                var user = await _userManager.FindByNameAsync(model.username);

                if (user == null) 
                {
                    throw new InvalidOperationException("Access denind. User is not authorized.");
                }

                bool isCorectPassword = await _userManager.CheckPasswordAsync(user, model.password);

                if (!isCorectPassword)
                {
                    throw new InvalidOperationException("Access denind. Password is not correct.");
                }

                var authClaims = new List<Claim> 
                { 
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString())
                };

                var accessToken = GenerateToken(authClaims);
                var refreshToken = GenerateRefreshToken();

                if (int.TryParse(_configuration["JWT:RefreshTokenValidityInDays"],out int refreshTokenValidityInDays))
                {
                    user.RefreshToken = refreshToken;
                    user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(refreshTokenValidityInDays);

                    await _userManager.UpdateAsync(user);

                    return ResponseFactory<AuthResultStruct>.CreateSuccessResponse(new AuthResultStruct
                    { 
                        token = new JwtSecurityTokenHandler().WriteToken(accessToken),
                        RefreshToken = refreshToken,
                        Expiration = accessToken.ValidTo
                    });
                }
                else
                {
                    throw new InvalidOperationException("Invalid cofiguration for refresh token");
                }
            }
            catch (Exception exception)
            {
                return ResponseFactory<AuthResultStruct>.CreateErrorResponse(exception);
            }
        }


        /// <summary>
        /// Выполняет регистрацию нового пользователя в системе с проверкой уникальности имени и валидацией данных
        /// </summary>
        /// <param name="model">Модель регистрации, содержащая личные данные пользователя (имя, email, телефон, пароль)</param>
        /// <returns>Объект ответа с данными зарегистрированного пользователя (Id, Email, PhoneNumber, FirstName, LastName, MiddleName)</returns>
        /// <exception cref="UnauthorizedAccessException">Возникает, если пользователь с таким именем уже существует или создание пользователя не удалось</exception>
        public async Task<IResponse<UserDto>> Register(RegisterModel model)
        {
            try
            {
                ObjectValidator<RegisterModel>.CheckIsNotNull(model);

                var userExists = await _userManager.FindByNameAsync(model.UserName);

                if (userExists != null)
                {
                    throw new UnauthorizedAccessException("This user already exists, please edit username!");
                }

                var user = new AdminUser
                {
                    Email = model.Email,
                    UserName = model.UserName,
                    PhoneNumber = model.PhoneNumber,
                    FirstName = model.FirstName, 
                    LastName = model.LastName,
                    SecurityStamp = Guid.NewGuid().ToString()
                };

                IdentityResult createResult = await _userManager.CreateAsync(user, model.Password);

                if (!createResult.Succeeded)
                {
                    throw new UnauthorizedAccessException("User creation faild! Please check user details and try again! \n" +
                        "Identity Errors: Enter corect password");
                }

                var userDto = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    MiddleName = user.MiddleName
                };

                return ResponseFactory<UserDto>.CreateSuccessResponse(userDto);
            }
            catch (Exception exception)
            {
                return ResponseFactory<UserDto>.CreateErrorResponse(exception);
            }
        }

        /// <summary>
        /// Отзывает все токены обновления (refreshToken) у всех пользователей
        /// </summary>
        /// <returns>Ответ с булевым значением true в случае успешного отзыва всех токенов, либо ошибкой в случае неудачи</returns>
        public async Task<IResponse<bool>> RevokeAllRefreshTokens()
        {
            try
            {
                var users = _userManager.Users.ToList();

                foreach (var user in users)
                {
                    user.RefreshToken = null;
                    await _userManager.UpdateAsync(user);
                }

                return ResponseFactory<bool>.CreateSuccessResponse(true);
            }
            catch (Exception exception)
            {
                return ResponseFactory<bool>.CreateErrorResponse(exception);
            }
        }

        /// <summary>
        /// Отзывает токен обновления (refreshToken) у пользователя по имени пользователя
        /// </summary>
        /// <param name="username">Имя пользователя, у которого необходимо отозвать токен обновления</param>
        /// <returns>Ответ с булевым значением true в случае успешного отзыва токена, либо ошибкой в случае неудачи</returns>
        public async Task<IResponse<bool>> RevokeRefreshTokenByUserName(string username)
        {
            try
            {
                StringValidator.CheckIsNotNull(username);

                var user = await _userManager.FindByNameAsync(username);

                ObjectValidator<AdminUser>.CheckIsNotNull(user);

                user.RefreshToken = null;
                await _userManager.UpdateAsync(user);

                return ResponseFactory<bool>.CreateSuccessResponse(true);
            }
            catch (Exception exception)
            {
                return ResponseFactory<bool>.CreateErrorResponse(exception);
            }
        }

        /// <summary>
        /// Обновляет пару токенов (accessToken и refreshToken) по истёкшему токену доступа и действующему токену обновления
        /// </summary>
        /// <param name="model">Модель, содержащая истёкший accessToken и refreshToken</param>
        /// <returns>Ответ с новой парой токенов (accessToken и refreshToken) и сроком их действия в случае успеха, либо ошибкой в случае неудачи</returns>
        public async Task<IResponse<AuthResultStruct>> UpdateToken(TokenModel model)
        {
            try
            {
                ObjectValidator<TokenModel>.CheckIsNotNull(model);
                 
                string accessToken = model.AccessToken;
                string refreshToken = model.RefreshToken;

                ClaimsPrincipal principal = GetClaimsPrincipal(accessToken);

                if (principal == null)
                {
                    throw new UnauthorizedAccessException("Invalid AccessToken or RefreshToken");
                }

                string username = principal.Identity.Name;
                var user = await _userManager.FindByNameAsync(username);

                if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
                {
                    throw new UnauthorizedAccessException("Invalid AccessToken or RefreshToken");
                }

                var newAccessToken = GenerateToken(principal.Claims.ToList());
                var newRefreshToken = GenerateRefreshToken();

                user.RefreshToken = newRefreshToken;

                await _userManager.UpdateAsync(user);

                return ResponseFactory<AuthResultStruct>.CreateSuccessResponse(new AuthResultStruct 
                { 
                    token = new JwtSecurityTokenHandler().WriteToken(newAccessToken),
                    RefreshToken = newRefreshToken,
                    Expiration = newAccessToken.ValidTo
                });
            }
            catch (Exception exception)
            {
                return ResponseFactory<AuthResultStruct>.CreateErrorResponse(exception);
            }
        }

        /// <summary>
        /// Генерирует безопасный токен обновления (refreshToken) для продления сессии пользователя
        /// </summary>
        /// <returns>Токен обновления</returns>
        protected override string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var randomNumberGenerator = RandomNumberGenerator.Create();
            randomNumberGenerator.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        /// <summary>
        /// Создаёт JWT-токен доступа (accessToken) на основе списка утверждений (claims) пользователя с использованием конфигурационных настроек безопасности
        /// </summary>
        /// <param name="claims">Список утверждений (claims) пользователя, включающий идентификационные данные и права доступа</param>
        /// <returns>Подписанный JWT-токен безопасности (JwtSecurityToken) с установленными издателем, аудиторией, сроком действия и учётными данными подписи</returns>
        protected override JwtSecurityToken GenerateToken(List<Claim> claims)
        {
            ObjectValidator<List<Claim>>.CheckIsNotNull(claims);

            SymmetricSecurityKey authSigninKey = GetSymmetricSecurityKey();

            bool IsTokenValidity = int.TryParse(_configuration["JWT:TokenValidityInMinutes"],out int tokenValidityInMinutes);

            return new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIsIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddMinutes(IsTokenValidity ? tokenValidityInMinutes : 0),
                claims: claims,
                signingCredentials: new SigningCredentials(authSigninKey, SecurityAlgorithms.HmacSha256)
                );
        }

        /// <summary>
        /// Возвращает основные утверждения (claims) из истёкшего JWT токена доступа (accessToken) без проверки времени жизни
        /// </summary>
        /// <param name="accessToken">Токен доступа (accessToken), который может быть истёкшим</param>
        /// <returns>Основные утверждения (claims) из токена в виде ClaimsPrincipal</returns>
        /// <exception cref="SecurityTokenException">Выбрасывается, если токен имеет неверный формат или алгоритм подписи отличается от HMACSHA256</exception>
        protected override ClaimsPrincipal GetClaimsPrincipal(string? accessToken) 
        {
            StringValidator.CheckIsNotNull(accessToken);

            var tokenValidationParametrs = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = GetSymmetricSecurityKey(),
                ValidateLifetime = false
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(accessToken, tokenValidationParametrs, out SecurityToken securityToken);

            if (securityToken is not JwtSecurityToken jwtSecurityToken || 
                !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256,StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid token");
            }
            return principal;
        }

        /// <summary>
        /// Возвращает симметричный ключ безопасности для подписи и валидации JWT токенов
        /// </summary>
        /// <returns>Симметричный ключ безопасности, созданный из секретного ключа, хранящегося в конфигурации</returns>
        protected override SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
        }
    }
}
