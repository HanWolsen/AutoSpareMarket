using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoSpareMarket.DAL.Migrations
{
    /// <inheritdoc />
    public partial class init3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_WarehoudeCells_WarehouseCellId",
                table: "Products");

            migrationBuilder.DropTable(
                name: "WarehoudeCells");

            migrationBuilder.CreateTable(
                name: "WarehouseCells",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CellNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WarehouseCells", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Products_WarehouseCells_WarehouseCellId",
                table: "Products",
                column: "WarehouseCellId",
                principalTable: "WarehouseCells",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_WarehouseCells_WarehouseCellId",
                table: "Products");

            migrationBuilder.DropTable(
                name: "WarehouseCells");

            migrationBuilder.CreateTable(
                name: "WarehoudeCells",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CellNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WarehoudeCells", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Products_WarehoudeCells_WarehouseCellId",
                table: "Products",
                column: "WarehouseCellId",
                principalTable: "WarehoudeCells",
                principalColumn: "Id");
        }
    }
}
