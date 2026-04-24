using AutoSpareMarket.Domain.Models.Entities.FrontEnd;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.DAL.SqlServer.Configuration
{
    internal class ProductSpecsConfiguration : IEntityTypeConfiguration<ProductSpecs>
    {
        public void Configure(EntityTypeBuilder<ProductSpecs> builder)
        {
            builder.HasKey(pi => pi.Id);

            builder.HasOne(pi => pi.Product)
                .WithMany(p => p.ProductSpecs)
                .HasForeignKey(pi => pi.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
