using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using AutoSpareMarket.Domain.Models.Entities;

namespace AutoSpareMarket.DAL.SqlServer.Configuration
{
    internal class ManagerConfiguration : IEntityTypeConfiguration<Manager>
    {
        public void Configure(EntityTypeBuilder<Manager> builder)
        {
            builder.HasKey(u => u.Id);
            builder.Property(u => u.Name).IsRequired().HasMaxLength(50);
            builder.Property(u => u.Email).IsRequired().HasMaxLength(50);

            builder.HasMany(u => u.Orders)
                   .WithOne(o => o.Manager)
                   .HasForeignKey(o => o.ManagerId);
        }
    }
}
