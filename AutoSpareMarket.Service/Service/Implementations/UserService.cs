using AutoSpareMarket.APIModels.DTO.DTOs.Auth;
using AutoSpareMarket.APIModels.Response.Helpers;
using AutoSpareMarket.APIModels.Response.Interfaces;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Service.Helpers.Constans;
using AutoSpareMarket.Service.Helpers.Maping;
using AutoSpareMarket.Service.Service.Intarfaces;
using AutoSpareMarket.Validation;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;

namespace AutoSpareMarket.Service.Service.Implementations
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;

        /// <summary>
        /// Инициализирует новый экземпляр менеджера аутентификации с необходимыми зависимостями
        /// </summary>
        /// <param name="userManager">Менеджер пользователя для управления операциями с пользователями</param>
        public UserService(UserManager<User> userManager)
        {
            ObjectValidator<UserManager<User>>.CheckIsNotNull(userManager);
            _userManager = userManager;
        }

        /// <summary>
        /// Удаляет пользователя по идентификатору
        /// </summary>
        /// <param name="Id">Идентификатор пользователя</param>
        /// <returns>Ответ с булевым значением true в случае успешного удаления, либо ошибкой в случае неудачи</returns>
        public async Task<IResponse<bool>> DeleteByIdAsync(int Id)
        {
            try
            {
                User user = await _userManager.FindByIdAsync(Id.ToString());

                ObjectValidator<User>.CheckIsNotNull(user);

                IdentityResult result = await _userManager.DeleteAsync(user);

                if (result.Succeeded)
                {
                    return ResponseFactory<bool>.CreateSuccessResponse(true);
                }
                else
                {
                    throw new Exception("Error when delete user");
                }
            }
            catch (Exception exception)
            {
                return ResponseFactory<bool>.CreateErrorResponse(exception);
            }
        }

        /// <summary>
        /// Возвращает электронную почту администратора
        /// </summary>
        /// <returns>Ответ с электронной почтой администратора в случае успеха, либо ошибкой в случае неудачи</returns>
        public async Task<IResponse<string>> GetAdminsEmail()
        {
            try
            {
                var user = await _userManager.FindByNameAsync(AdminInfo.AdminName);

                ObjectValidator<User>.CheckIsNotNull(user);

                return ResponseFactory<string>.CreateSuccessResponse(user.Email);
            }
            catch (Exception exception)
            {
                return ResponseFactory<string>.CreateErrorResponse(exception);
            }
        }

        /// <summary>
        /// Возвращает список всех пользователей в виде DTO (объектов передачи данных)
        /// </summary>
        /// <returns>Ответ со списком DTO пользователей в случае успеха, либо ошибкой в случае неудачи</returns>
        public IResponse<List<UserDto>> GetAll()
        {
            try
            {
                List<User> users = _userManager.Users.ToList();

                ObjectValidator<List<User>>.CheckIsNotNull(users);

                List<UserDto> userDtos = new List<UserDto>();

                foreach (User user in users) 
                {
                    UserDto userDto= new UserDto 
                    { 
                        Id = user.Id,
                        UserName = user.UserName,
                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        MiddleName = user.MiddleName
                    };

                    userDtos.Add(userDto);
                }

                return ResponseFactory<List<UserDto>>.CreateSuccessResponse(userDtos);
            }
            catch (Exception exception)
            {
                return ResponseFactory<List<UserDto>>.CreateErrorResponse(exception);
            }
        }

        /// <summary>
        /// Возвращает пользователя по идентификатору в виде DTO (объекта передачи данных)
        /// </summary>
        /// <param name="Id">Идентификатор пользователя</param>
        /// <returns>Ответ с DTO пользователя в случае успеха, либо ошибкой в случае неудачи</returns>
        public async Task<IResponse<UserDto>> GetByIdAsync(int Id)
        {
            try
            {
                ObjectValidator<int>.CheckIsNotNull(Id);

                var user = await _userManager.FindByIdAsync(Id.ToString());

                ObjectValidator<User>.CheckIsNotNull(user);

                UserDto userDto = new UserDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
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
        /// Обновляет указанное свойство администратора с использованием делегатов
        /// </summary>
        /// <typeparam name="T">Тип значения обновляемого свойства</typeparam>
        /// <param name="propertySelector">Делегат для выбора свойства администратора (не используется в текущей реализации, но может быть полезен для валидации)</param>
        /// <param name="propertyUpdater">Делегат для обновления свойства администратора новым значением</param>
        /// <param name="newValue">Новое значение для обновляемого свойства</param>
        /// <returns>Ответ с идентификатором администратора в случае успеха, либо ошибкой в случае неудачи</returns>
        public async Task<IResponse<string>> UpdateAdminsProperty<T>(
            Func<User, T> propertySelector, Action<User, T> propertyUpdater, T newValue)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(AdminInfo.AdminName);

                ObjectValidator<User>.CheckIsNotNull(user);

                propertyUpdater(user, newValue);

                await _userManager.UpdateAsync(user);

                return ResponseFactory<string>.CreateSuccessResponse(user.Id.ToString());
            }
            catch (Exception exception)
            {
                return ResponseFactory<string>.CreateErrorResponse(exception);
            }
        }

        /// <summary>
        /// Обновляет данные пользователя на основе переданного DTO (объекта передачи данных)
        /// </summary>
        /// <param name="dto">DTO с обновлёнными данными пользователя</param>
        /// <returns>Ответ с булевым значением true в случае успешного обновления, либо ошибкой в случае неудачи</returns>
        public async Task<IResponse<bool>> UpdateAsync(UserDto dto)
        {
            try
            {
                ObjectValidator<UserDto>.CheckIsNotNull(dto);

                User user = await _userManager.FindByIdAsync(dto.Id.ToString());

                user.Email = dto.Email;
                user.FirstName = dto.FirstName;
                user.LastName = dto.LastName;   
                user.MiddleName = dto.MiddleName;
                await _userManager.UpdateAsync(user);

                return ResponseFactory<bool>.CreateSuccessResponse(true);
            }
            catch (Exception exception)
            {
                return ResponseFactory<bool>.CreateErrorResponse(exception);
            }
        }
    }
}