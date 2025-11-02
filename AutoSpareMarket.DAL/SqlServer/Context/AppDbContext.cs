using AutoSpareMarket.DAL.SqlServer.Configuration;
using AutoSpareMarket.Domain.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace AutoSpareMarket.DAL.SqlServer.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext() : base()
        {
            Database.EnsureCreated();
        }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        DbSet<Manager> Managers { get; set; }
        DbSet<CashRegister> CashRegister { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder
                .ApplyConfigurationsFromAssembly(typeof(ManagerConfiguration).Assembly)
                .ApplyConfigurationsFromAssembly(typeof(CashRegisterConfiguration).Assembly)
                ;
        }
    }
}
