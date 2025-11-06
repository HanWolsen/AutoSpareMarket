using AutoSpareMarket.Domain.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoSpareMarket.DAL.SqlServer.Configuration
{
    internal class SaleConfiguration : IEntityTypeConfiguration<Sale>
    {
        public void Configure(EntityTypeBuilder<Sale> builder)
        {
            builder.HasKey(u => u.Id);
            builder.Property(u => u.PaymentMethod);
            builder.Property(u => u.TotalAmaunt);

            builder.HasMany(cr => cr.SaleItems)
                .WithOne(t => t.Sale)
                .HasForeignKey(t => t.SaleId);

            builder.HasMany(cr => cr.Transactions)
                .WithOne(t => t.Sale)
                .HasForeignKey(t => t.SaleId);
        }
    }
}
