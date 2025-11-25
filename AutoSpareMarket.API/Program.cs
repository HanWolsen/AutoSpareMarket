using AutoSpareMarket.API;
using AutoSpareMarket.API.Properties;
using AutoSpareMarket.DAL.SqlServer.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

ConfigurationManager configuration = builder.Configuration;

var connection = configuration.GetConnectionString("ConnectionString"); ;

// Add services to the container.

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(connection, sqlOptions =>
{
    sqlOptions.EnableRetryOnFailure();
}));

builder.Services
    .InitializeRepositories()
    .InitializeServices();

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.WriteIndented = true;
});


// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(x =>
{
    x.SwaggerDoc("v1", new OpenApiInfo { Version = "v1", Title = "AutoSpareMarket" });

    x.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter JWT with Bearer into field",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "bearer",
    });

    x.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    x.CustomSchemaIds(t => t.FullName);

    // Добавляем фильтр для обработки multipart/form-data
    x.OperationFilter<SwaggerFileOperationFilter>();
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyHeader();
        policy.AllowAnyMethod();
        policy.AllowAnyOrigin();
    });
});

var app = builder.Build();

// Swagger для разработки
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware для обработки HTTPS и CORS
app.UseHttpsRedirection();
app.UseCors("AllowAll");

// Middleware для статических файлов (фронтенда)
app.UseStaticFiles();

// Аутентификация и авторизация
app.UseAuthentication();
app.UseAuthorization();

// Маршрут SPA (Fallback для фронта)
//app.MapFallbackToFile("b3A5V7gD8s2M3pF1Yq2L9Hj7Xk5YtEr4Zz7U8K2Vw1Jm3RzQ7Pq9LdF9NvXm5Jq.html");
app.MapFallbackToFile("index.html");
//app.MapFallbackToFile("catalog.html");


// Маршруты API
app.MapControllers();

app.Run();