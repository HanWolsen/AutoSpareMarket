

using AutoSpareMarket.APIModels.DTO.DTOs.Auth;
using AutoSpareMarket.APIModels.DTO.DTOs.Orders;
using AutoSpareMarket.APIModels.DTO.DTOs.Products;
using AutoSpareMarket.APIModels.Response.Interfaces;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Service.Service.Implementations;
using AutoSpareMarket.Service.Service.Intarfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace AutoSpareMarket.API.Controllers
{
    [Route("api/v1/user")]
    public class UserController : BaseApiController
    {
        private readonly IUserService _userService;
        private readonly ITokenManager<User> _tokenManager;
        private readonly IAuthManager<User> _authManager;

        public UserController(IUserService userService,
                              ITokenManager<User> tokenManager,
                              IAuthManager<User> authManager)
        {
            _userService = userService;
            _tokenManager = tokenManager;
            _authManager = authManager;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var response = await _authManager.Login(model);

            if (response.IsSuccess)
            {
                return Ok(response);
            }

            return Unauthorized(response.Message);
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var response = await _authManager.Register(model);

            if (response.IsSuccess)
            {
                return Ok(response);
            }

            return Unauthorized(response.Message);
        }

        [HttpPost]
        [Route("update-token")]
        public async Task<IActionResult> UpdateAccessToken(TokenModel model)
        {
            var response = await _tokenManager.UpdateToken(model);

            if (response.IsSuccess)
            {
                return Ok(response);
            }

            return BadRequest(response.Message);
        }

        [HttpPost]
        [Route("revork-refresh-token")]
        public async Task<IActionResult> RevokeRefreshToken(string username)
        {
            var response = await _tokenManager.RevokeRefreshTokenByUserName(username);

            if (response.IsSuccess)
            {
                return Ok(response);
            }

            return BadRequest(response.Message);
        }

        [HttpPost]
        [Route("revork-all-refresh-token")]
        public async Task<IActionResult> RevokeAllRefreshTokens()
        {
            var response = await _tokenManager.RevokeAllRefreshTokens();

            if (response.IsSuccess)
            {
                return Ok(response);
            }

            return BadRequest(response.Message);
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public IActionResult GetAll()
            => HandleResponse(_userService.GetAll());

        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
            => HandleResponse(_userService.GetByIdAsync(id));

        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] UserDto dto)
        {
            dto.Id = id;
            return HandleResponse(_userService.UpdateAsync(dto));
        }

        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
            => HandleResponse(_userService.DeleteByIdAsync(id));

        [HttpGet]
        [Route("get-admins-email")]
        public IActionResult GetAdminsEmail()
            => HandleResponse(_userService.GetAdminsEmail());

        [HttpPost]
        [Route("update-email")]
        public async Task<IActionResult> UpdateEmail([FromBody] string email)
        {
            IResponse<string> response = await _userService.UpdateAdminsProperty(
                user => user.Email, 
                (user, value) => user.Email = value,
                email 
                );

            if (response.IsSuccess)
            {
                return Ok(response);
            }

            return BadRequest(response.Message);
        }

        [HttpPost]
        [Route("update-phone-number")]
        public async Task<IActionResult> UpdatePhoneNumber([FromBody] string phoneNumber)
        {
            IResponse<string> response = await _userService.UpdateAdminsProperty(
                user => user.PhoneNumber,
                (user, value) => user.PhoneNumber = value,
                phoneNumber
                );

            if (response.IsSuccess)
            {
                return Ok(response);
            }

            return BadRequest(response.Message);
        }

        [HttpPost]
        [Route("update-user-name")]
        public async Task<IActionResult> UpdateUserName([FromBody] string userName)
        {
            IResponse<string> response = await _userService.UpdateAdminsProperty(
                user => user.UserName,
                (user, value) => user.UserName = value,
                userName
                );

            if (response.IsSuccess)
            {
                return Ok(response);
            }

            return BadRequest(response.Message);
        }
    }
}
