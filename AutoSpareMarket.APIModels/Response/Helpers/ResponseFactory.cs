using AutoSpareMarket.APIModels.Response.Implementations;

namespace AutoSpareMarket.APIModels.Response.Helpers
{
    public static class ResponseFactory<T>
    {
        public static Response<T> CreateSuccessResponse(T model)
        {
            return new Response<T>
            {
                IsSuccess = true, 
                Data = model,
                StatusCode = 200
            };
        }

        public static Response<T> CreateErrorResponse(Exception exception)
        {
            return new Response<T>
            {
                IsSuccess = false,
                StatusCode = 200,
                Message = $"Внтреннее ошибка сервиса : {exception}"
            };
        }
    }
}
