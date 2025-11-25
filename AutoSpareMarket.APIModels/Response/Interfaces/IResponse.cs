namespace AutoSpareMarket.APIModels.Response.Interfaces
{
    public interface IResponse<T>
    {
        T Data { get; set; }
        int StatusCode { get; set; }
        string Message { get; set; }
        bool IsSuccess { get; set; }
    }
}
