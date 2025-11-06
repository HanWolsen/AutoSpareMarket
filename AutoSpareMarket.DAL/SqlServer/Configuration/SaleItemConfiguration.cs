using AutoSpareMarket.Domain.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoSpareMarket.DAL.SqlServer.Configuration
{
    internal class SaleItemConfiguration : IEntityTypeConfiguration<SaleItem>
    {
        public void Configure(EntityTypeBuilder<SaleItem> builder)
        {
            builder.HasKey(u => u.Id);
            builder.Property(u => u.Quantity);
            builder.Property(u => u.UnitPrice);
            builder.Property(u => u.UnitCost);
        }
    }
}
