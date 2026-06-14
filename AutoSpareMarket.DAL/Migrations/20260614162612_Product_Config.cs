using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoSpareMarket.DAL.Migrations
{
    /// <inheritdoc />
    public partial class Product_Config : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_WarehouseCells_WarehouseCellId",
                table: "Products");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_WarehouseCells_WarehouseCellId",
                table: "Products",
                column: "WarehouseCellId",
                principalTable: "WarehouseCells",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_WarehouseCells_WarehouseCellId",
                table: "Products");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_WarehouseCells_WarehouseCellId",
                table: "Products",
                column: "WarehouseCellId",
                principalTable: "WarehouseCells",
                principalColumn: "Id");
        }
    }
}
