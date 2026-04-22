using AutoSpareMarket.APIModels.DTO.DTOs.Auth;
using AutoSpareMarket.DAL.Repository.Implementations;
using AutoSpareMarket.DAL.Repository.Intarfacec;
using AutoSpareMarket.DAL.Repository.Interfaces;
using AutoSpareMarket.DAL.SqlServer.Context;
using AutoSpareMarket.Domain.Models.Abstractions;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Service.Helpers.Constans;
using AutoSpareMarket.Service.Interfaces;
using AutoSpareMarket.Service.Service.Implementations;
using AutoSpareMarket.Service.Service.Intarfaces;
using AutoSpareMarket.Service.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace AutoSpareMarket.API
{
    public static class Initializer
    {
        /// <summary>
        /// Инициализирует и регистрирует репозитории в контейнере внедрения зависимостей
        /// </summary>
        /// <param name="services">Коллекция сервисов для регистрации зависимостей</param>
        /// <returns>Коллекция сервисов с зарегистрированными репозиториями</returns>
        public static IServiceCollection InitializeRepositories(this IServiceCollection services)
        {
            services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
            services.AddScoped(typeof(IBaseGuidRepository<>), typeof(BaseGuidRepository<>));

            services.AddScoped(typeof(UserManager<>));
            return services;
        }

        /// <summary>
        /// Инициализирует и регистрирует сервисы бизнес-логики в контейнере внедрения зависимостей
        /// </summary>
        /// <param name="services">Коллекция сервисов для регистрации зависимостей</param>
        /// <returns>Коллекция сервисов с зарегистрированными сервисами</returns>
        public static IServiceCollection InitializeServices(this IServiceCollection services)
        {
            services.AddScoped(typeof(IBaseService<>), typeof(BaseService<>));
            services.AddScoped(typeof(IBaseGuidService<>), typeof(BaseGuidService<>));

            //[8.1] Добавить все использованные зависимости(все сервисы) в контейнер внедрения зависимостей
            services.AddScoped<IProductImagesService, ProductImagesService>();

            services.AddScoped<IProductExtendedService, ProductExtendedService>();
            services.AddScoped<ISupplierExtendedService, SupplierExtendedService>();
            services.AddScoped<IOrderExtendedService, OrderExtendedService>();
            services.AddScoped<ISaleExtendedService, SaleExtendedService>();
            services.AddScoped<ICashRegisterExtendedService, CashRegisterExtendedService>();
            services.AddScoped<ICustomerExtendedService, CustomerExtendedService>();
            services.AddScoped<IAnalyticsService, AnalyticsService>();
            services.AddScoped<IPromotionExtendedService, PromotionExtendedService>();
            services.AddScoped<IUserService,UserService>();
            services.AddScoped<IUserStore<User>, UserStore<User, IdentityRole<int>, AppDbContext, int>>();

            
            return services;
        }

        /// <summary>
        /// Инициализирует и настраивает систему аутентификации и Identity в контейнере внедрения зависимостей
        /// </summary>
        /// <param name="services">Коллекция сервисов для регистрации зависимостей</param>
        /// <param name="configuration">Конфигурация приложения для доступа к настройкам JWT</param>
        /// <returns>Коллекция сервисов с настроенной аутентификацией и Identity</returns>
        public static IServiceCollection InitializeIdentity(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IAuthManager<User>>(provider =>
            {
                var userManager = provider.GetRequiredService<UserManager<User>>();
                return new AuthManager<User>(userManager, configuration);
            });

            services.AddScoped(typeof(ITokenManager<User>), typeof(AuthManager<User>));

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters() 
                { 
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ClockSkew = TimeSpan.Zero,

                    ValidAudience = configuration["JWT:ValidAudience"],
                    ValidIssuer = configuration["JWT:ValidIsIssuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]))
                };
            });

            services.AddIdentity<ApplicationUser, IdentityRole<int>>()
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders();

            services.AddScoped<IUserStore<User>, UserStore<User, IdentityRole<int>, AppDbContext, int>>();
            services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

            return services;
        }

        /// <summary>
        /// Инициализирует и настраивает менеджер ролей, а также выполняет начальное заполнение ролей в системе
        /// </summary>
        /// <param name="services">Коллекция сервисов для регистрации зависимостей</param>
        /// <returns>Задача, представляющая асинхронную операцию инициализации ролей</returns>
        public static async Task InitializeRoles(this IServiceCollection services)
        {
            services.AddScoped<RoleManager<IdentityRole>>();
            services.AddScoped<IRoleStore<IdentityRole>, RoleStore<IdentityRole>>();
            
            var roleManager = services.BuildServiceProvider().GetRequiredService<RoleManager<IdentityRole>>();

            await SeedRoles(roleManager);
        }

        /// <summary>
        /// Выполняет начальное заполнение базы данных ролями из перечисления RoleType
        /// </summary>
        /// <param name="roleManager">Менеджер ролей для управления операциями с ролями</param>
        /// <returns>Задача, представляющая асинхронную операцию заполнения ролей</returns>
        private static async Task SeedRoles(RoleManager<IdentityRole> roleManager)
        {
            foreach (var role in Enum.GetValues(typeof(RoleType)).Cast<RoleType>())
            {
                var roleName = role.ToString();

                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }
        }

        /// <summary>
        /// Выполняет начальное заполнение базы данных пользователем-администратором
        /// </summary>
        /// <param name="services">Коллекция сервисов для получения зависимостей</param>
        /// <returns>Задача, представляющая асинхронную операцию создания администратора</returns>
        public static async Task SeedAdmins(this IServiceCollection services)
        {
            var userManager = services.BuildServiceProvider().GetRequiredService<UserManager<User>>();

            string adminName = AdminInfo.AdminName;

            var user = await userManager.FindByNameAsync(adminName);
            if (user != null) return;

            var admin = new User()
            {
                Id = AdminInfo.Id,
                UserName = AdminInfo.UserName,
                PhoneNumber = AdminInfo.PhoneNumber,
                Email = AdminInfo.Email,
                FirstName = AdminInfo.FirstName,
                MiddleName = AdminInfo.MiddleName,
                LastName = AdminInfo.LastName,
                NormalizedUserName = AdminInfo.NormalizedUserName,
                NormalizedEmail = AdminInfo.NormalizedEmail,
            };
            var passwordHasher = new PasswordHasher<ApplicationUser>();

            admin.PasswordHash = passwordHasher.HashPassword(admin, AdminInfo.Password);

            await userManager.CreateAsync(admin);
            await userManager.AddToRoleAsync(admin, RoleType.Admin.ToString());
        }
    }
}
