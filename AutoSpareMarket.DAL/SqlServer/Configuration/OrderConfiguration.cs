using AutoSpareMarket.Domain.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.DAL.SqlServer.Configuration
{
    internal class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasKey(u => u.Id);
            builder.Property(u => u.TotalAmount);
            builder.Property(u => u.Status);
            builder.Property(u => u.CreatedAt);

            builder.HasMany(cr => cr.OrderItems)
                .WithOne(t => t.Order)
                .HasForeignKey(t => t.OrderId);
        }
    }
}
