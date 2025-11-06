using AutoSpareMarket.Domain.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoSpareMarket.DAL.SqlServer.Configuration
{
    internal class WarehoudeCellConfiguration : IEntityTypeConfiguration<WarehoudeCell>
    {
        public void Configure(EntityTypeBuilder<WarehoudeCell> builder)
        {
            builder.HasKey(u => u.Id);
            builder.Property(u => u.CellNumber);
            builder.Property(u => u.Quantity);

            builder.HasMany(cr => cr.Products)
                .WithOne(t => t.WarehouseCell)
                .HasForeignKey(t => t.WarehouseCellId);
        }
    }
}
