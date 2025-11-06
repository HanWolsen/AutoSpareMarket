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
    internal class SupplierProductConfiguration : IEntityTypeConfiguration<SupplierProduct> 
    {
        public void Configure(EntityTypeBuilder<SupplierProduct> builder)
        {
            builder.HasKey(u => u.Id);
        }
    }
}
