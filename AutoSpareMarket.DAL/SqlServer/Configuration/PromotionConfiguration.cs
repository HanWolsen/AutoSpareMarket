using AutoSpareMarket.Domain.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoSpareMarket.DAL.SqlServer.Configuration
{
    internal class PromotionConfiguration : IEntityTypeConfiguration<Promotion>
    {
        public void Configure(EntityTypeBuilder<Promotion> builder)
        {
            builder.HasKey(u => u.Id);
            builder.Property(u => u.Name);
            builder.Property(u => u.PromotionType);
            builder.Property(u => u.DiscountPercent);
            builder.Property(u => u.DiscountPercent);
            builder.Property(u => u.StartAt);
            builder.Property(u => u.EndAt);
        }
    }
}
