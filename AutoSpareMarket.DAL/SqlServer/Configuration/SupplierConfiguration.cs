using AutoSpareMarket.Domain.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.DAL.SqlServer.Configuration
{
    internal class SupplierConfiguration : IEntityTypeConfiguration<Supplier> 
    {
        public void Configure(EntityTypeBuilder<Supplier> builder)
        {
            builder.HasKey(u => u.Id);
            builder.Property(u => u.Name);
            builder.Property(u => u.Country);
            builder.Property(u => u.IsActive);
            builder.Property(u => u.CountryInfo);
            builder.Property(u => u.CreateAt);

            builder.HasMany(cr => cr.Orders)
                .WithOne(t => t.Supplier)
                .HasForeignKey(t => t.SuplierId);

            builder.HasMany(cr => cr.SellItems)
                .WithOne(t => t.Supplier)
                .HasForeignKey(t => t.SupplierId);
        }
    }
}
