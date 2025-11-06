using AutoSpareMarket.Domain.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoSpareMarket.DAL.SqlServer.Configuration
{
    internal class OrderItemConfigguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            builder.HasKey(u => u.Id);
            builder.Property(u => u.Quantity);
            builder.Property(u => u.UnitPrice);
            builder.Property(u => u.ReceivedQuantity);
        }
    }
}
