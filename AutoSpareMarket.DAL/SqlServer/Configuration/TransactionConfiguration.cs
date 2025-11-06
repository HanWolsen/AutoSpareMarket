using AutoSpareMarket.Domain.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoSpareMarket.DAL.SqlServer.Configuration
{
    internal class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
    {
        public void Configure(EntityTypeBuilder<Transaction> builder)
        {
            builder.HasKey(u => u.Id);
            builder.Property(u => u.Amount);
            builder.Property(u => u.Type);
            builder.Property(u => u.CreatedAt);
            builder.Property(u => u.Note);
        }
    }
}
