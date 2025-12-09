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

        DbSet<CashRegister> CashRegisters { get; set; }
        DbSet<Customer> Customers { get; set; }
        DbSet<Manager> Managers { get; set; }
        DbSet<Order> Orders { get; set; }
        DbSet<OrderItem> OrderItems { get; set; }
        DbSet<Product> Products { get; set; }
        DbSet<Promotion> Promotions { get; set; }
        DbSet<Sale> Sales { get; set; }
        DbSet<SaleItem> SaleItems { get; set; }
        DbSet<Supplier> Suppliers { get; set; }
        DbSet<SupplierProduct> SupplierProducts { get; set; }
        DbSet<Transaction> Transactions { get; set; }
        DbSet<WarehouseCell> WarehouseCells { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder
                .ApplyConfigurationsFromAssembly(typeof(CashRegisterConfiguration).Assembly)
                .ApplyConfigurationsFromAssembly(typeof(CustomerConfiguration).Assembly)
                .ApplyConfigurationsFromAssembly(typeof(ManagerConfiguration).Assembly)
                .ApplyConfigurationsFromAssembly(typeof(OrderConfiguration).Assembly)
                .ApplyConfigurationsFromAssembly(typeof(OrderItemConfigguration).Assembly)
                .ApplyConfigurationsFromAssembly(typeof(ProductConfiguration).Assembly)
                .ApplyConfigurationsFromAssembly(typeof(PromotionConfiguration).Assembly)
                .ApplyConfigurationsFromAssembly(typeof(SaleConfiguration).Assembly)
                .ApplyConfigurationsFromAssembly(typeof(SaleItemConfiguration).Assembly)
                .ApplyConfigurationsFromAssembly(typeof(SupplierConfiguration).Assembly)
                .ApplyConfigurationsFromAssembly(typeof(SupplierProductConfiguration).Assembly)
                .ApplyConfigurationsFromAssembly(typeof(TransactionConfiguration).Assembly)
                .ApplyConfigurationsFromAssembly(typeof(WarehouseCellConfiguration).Assembly)
                ;
        }
    }
}
