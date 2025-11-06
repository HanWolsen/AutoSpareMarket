using AutoSpareMarket.Domain.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoSpareMarket.DAL.SqlServer.Configuration
{
    internal class CustomerConfiguration : IEntityTypeConfiguration<Customer>
    {
        public void Configure(EntityTypeBuilder<Customer> builder)
        {
            builder.HasKey(u => u.Id);
            builder.Property(u => u.FirstName);
            builder.Property(u => u.LastName);
            builder.Property(u => u.Email);
            builder.Property(u => u.Phone);
            builder.Property(u => u.CreateAt);

            builder.HasMany(cr => cr.Sales)
                .WithOne(t => t.Customer)
                .HasForeignKey(t => t.CustomerId);
        }
    }
}
