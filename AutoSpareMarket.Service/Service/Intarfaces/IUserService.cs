using AutoSpareMarket.APIModels.DTO.DTOs.Auth;
using AutoSpareMarket.APIModels.DTO.DTOs.OrderItems;
using AutoSpareMarket.APIModels.DTO.DTOs.Orders;
using AutoSpareMarket.APIModels.Response.Interfaces;
using AutoSpareMarket.Domain.Models.Entities;

namespace AutoSpareMarket.Service.Service.Intarfaces
{
    public interface IUserService
    {
        IResponse<List<UserDto>> GetAll();
        Task<IResponse<UserDto>> GetByIdAsync(int Id);
        Task<IResponse<bool>> UpdateAsync(UserDto dto);
        Task<IResponse<bool>> DeleteByIdAsync(int Id);
        Task<IResponse<string>> GetAdminsEmail();
        Task<IResponse<UserDto>> GetByUserName(string username);
        Task<IResponse<string>> UpdateAdminsProperty<T>(Func<AdminUser,T> propertySelector,
            Action<AdminUser, T> propertyUpdater,T newValue);
    }
}
