using AutoSpareMarket.Domain.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoSpareMarket.DAL.SqlServer.Configuration
{
    internal class CashRegisterConfiguration : IEntityTypeConfiguration<CashRegister>
    {
        public void Configure(EntityTypeBuilder<CashRegister> builder)
        {
            builder.HasKey(u => u.Id);
            builder.Property(u => u.Name).IsRequired().HasMaxLength(50);
            builder.Property(u => u.Location).IsRequired().HasMaxLength(50);

            builder.HasMany(cr => cr.Transactions)
                .WithOne(t => t.CashRegister)
                .HasForeignKey(t => t.CashRegisterId);

            builder.HasMany(cr => cr.Sales)
                .WithOne(t => t.CashRegister)
                .HasForeignKey(t => t.CashRegisterId);
        }
    }
}
