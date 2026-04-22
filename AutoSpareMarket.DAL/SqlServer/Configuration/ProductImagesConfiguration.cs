using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Domain.Models.Entities.FrontEnd;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;

namespace AutoSpareMarket.DAL.SqlServer.Configuration
{
    // [4.1] Создать конфигурацию для сущности
    internal class ProductImagesConfiguration : IEntityTypeConfiguration<ProductImages>
    {
        public void Configure(EntityTypeBuilder<ProductImages> builder)
        {

                builder.HasKey(pi => pi.Id);  
    
                builder.HasOne(pi => pi.Product)
                    .WithMany(p => p.ProductImages)
                    .HasForeignKey(pi => pi.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

// [6] Применить Скрипт заполнения данными для таблицы ProductImages и Products(опционально) в SQL Server Management Studio
//SET IDENTITY_INSERT Products ON;

//INSERT INTO Products(Id, Name, Description, DateAdd, WarehouseCellId)
//VALUES
//(1, N'Product 1', N'Description for product 1', CONVERT(datetime2(6), '2026-04-18T16:57:14.612294', 126), NULL),
//(2, N'Product 2', N'Description for product 2', CONVERT(datetime2(6), '2026-04-18T16:57:14.612294', 126), NULL),
//(3, N'Product 3', N'Description for product 3', CONVERT(datetime2(6), '2026-04-18T16:57:14.612294', 126), NULL),
//(4, N'Product 4', N'Description for product 4', CONVERT(datetime2(6), '2026-04-18T16:57:14.612294', 126), NULL),
//(5, N'Product 5', N'Description for product 5', CONVERT(datetime2(6), '2026-04-18T16:57:14.612294', 126), NULL);

//INSERT INTO ProductImages(Id, ProductId, ImageUrl, IsPrimary, CreatedAt)
//VALUES
//('f05a099e-6927-471f-97db-4fe599c06c53', 1, 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=600', 1, CONVERT(datetimeoffset(6), '2026-04-18T16:57:14.612294+00:00', 127)),
//('a8457761-8874-4b98-9895-493620b931ea', 2, 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=600', 1, CONVERT(datetimeoffset(6), '2026-04-18T16:57:14.612294+00:00', 127)),
//('c51bcbc8-efb3-4722-bb19-93e9352b0f42', 3, 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=600', 1, CONVERT(datetimeoffset(6), '2026-04-18T16:57:14.612294+00:00', 127)),
//('3e922104-290a-45a7-944b-bce210dc2e4f', 4, 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=600', 1, CONVERT(datetimeoffset(6), '2026-04-18T16:57:14.612294+00:00', 127)),
//('5d2aa43e-2293-4d5a-9d70-4667e2b645e0', 5, 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg?auto=compress&cs=tinysrgb&w=600', 1, CONVERT(datetimeoffset(6), '2026-04-18T16:57:14.612294+00:00', 127));

//SELECT* FROM ProductImages

//SELECT* FROM Products
