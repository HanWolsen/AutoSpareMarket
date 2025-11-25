using AutoSpareMarket.APIModels.Response.Interfaces;
using AutoSpareMarket.Validation;

namespace AutoSpareMarket.APIModels.Response.Implementations
{
    public class Response<T> : IResponse<T>
    {
        private T _data;
        public T Data
        {
            get
            {
                return _data;
            }

            set
            {
                try
                {
                    ObjectValidator<T>.CheckIsNotNull(value);
                    _data = value;
                }
                catch (ArgumentNullException exception)
                {
                    _message += $"\nERROR: {exception}";
                }
            }
        }

        private int _statusCode;
        public int StatusCode
        {
            get
            {
                return _statusCode;
            }
            set
            {
                try
                {
                    _statusCode = value;
                }
                catch (ArgumentException exception)
                {
                    _message += $"\nERROR: {exception}";

                }
            }
        }


        private string _message;
        public string Message
        {
            get
            {
                return _message;
            }
            set
            {
                try
                {
                    StringValidator.CheckIsNotNull(value);
                    _message = value;
                }
                catch (ArgumentNullException exception)
                {
                    _message += $"\nERROR: {exception}";
                }
            }
        }

        public bool IsSuccess { get; set; }
    }
}
