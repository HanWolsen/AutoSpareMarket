using AutoSpareMarket.Domain.Models.Entities.FrontEnd;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoSpareMarket.DAL.SqlServer.Configuration
{
    internal class SupportRequestConfiguration : IEntityTypeConfiguration<SupportRequests>
    {
        public void Configure(EntityTypeBuilder<SupportRequests> builder)
        {
            builder.HasKey(pi => pi.Id);
        }
    }
}
