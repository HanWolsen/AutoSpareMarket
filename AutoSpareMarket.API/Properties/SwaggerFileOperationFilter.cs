using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace AutoSpareMarket.API.Properties
{
    public class SwaggerFileOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            if (operation.RequestBody != null)
            {
                operation.RequestBody.Content["multipart/form-data"] = new OpenApiMediaType
                {
                    Schema = new OpenApiSchema
                    {
                        Type = "object",
                        Properties =
                    {
                        ["image"] = new OpenApiSchema { Type = "string", Format = "binary" },
                        ["imageName"] = new OpenApiSchema { Type = "string" }
                    }
                    }
                };
            }
        }
    }
}
