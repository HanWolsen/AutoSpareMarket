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
    internal class StoreUserConfiguration : IEntityTypeConfiguration<StoreUsers>
    {
        public void Configure(EntityTypeBuilder<StoreUsers> builder)
        {
            builder.HasKey(pi => pi.Id);
        }
    }
}
