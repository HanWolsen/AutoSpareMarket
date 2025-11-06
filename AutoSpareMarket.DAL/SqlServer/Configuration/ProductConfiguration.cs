using AutoSpareMarket.Domain.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoSpareMarket.DAL.SqlServer.Configuration
{
    internal class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.HasKey(u => u.Id);
            builder.Property(u => u.Name);
            builder.Property(u => u.Description);
            builder.Property(u => u.DateAdd);

            builder.HasMany(cr => cr.SupplierProducts)
                .WithOne(t => t.Product)
                .HasForeignKey(t => t.ProductId);

            builder.HasMany(cr => cr.Promotions)
                .WithOne(t => t.Product)
                .HasForeignKey(t => t.ProductId);

            builder.HasMany(cr => cr.OrderItems)
                .WithOne(t => t.Product)
                .HasForeignKey(t => t.ProductId);

            //builder.HasMany(cr => cr.SaleItems)
            //.WithOne(t => t.Product)
            //.HasForeignKey(t => t.ProductId);
        }
    }
}
