using AutoSpareMarket.APIModels.DTO.DTOs.SaleItems;
using AutoSpareMarket.APIModels.DTO.DTOs.Sales;
using AutoSpareMarket.APIModels.DTO.DTOs.Transactions;
using AutoSpareMarket.APIModels.Response.Helpers;
using AutoSpareMarket.APIModels.Response.Interfaces;
using AutoSpareMarket.DAL.Repository.Intarfacec;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Service.Interfaces;
using AutoSpareMarket.Validation;

namespace AutoSpareMarket.Service.Services
{
    public class SaleExtendedService : ISaleExtendedService
    {
        private readonly IBaseRepository<Sale> _sales;
        private readonly IBaseRepository<SaleItem> _saleItems;
        private readonly IBaseRepository<Transaction> _transactions;
        private readonly IBaseRepository<Product> _products;
        private readonly IBaseRepository<WarehouseCell> _warehouseCells;
        private readonly IBaseRepository<Promotion> _promotions;

        public SaleExtendedService(IBaseRepository<Sale> sales,
                                   IBaseRepository<SaleItem> saleItems,
                                   IBaseRepository<Transaction> transactions,
                                   IBaseRepository<Product> products,
                                   IBaseRepository<WarehouseCell> warehouseCells,
                                   IBaseRepository<Promotion> promotions)
        {
            _sales = sales;
            _saleItems = saleItems;
            _transactions = transactions;
            _products = products;
            _warehouseCells = warehouseCells;
            _promotions = promotions;
        }

        public IResponse<SaleDto> CreateSale(SaleCreateDto dto)
        {
            try
            {
                ObjectValidator<SaleCreateDto>.CheckIsNotNull(dto);
                if (dto.Items == null || dto.Items.Count == 0)
                    throw new InvalidOperationException("Sale must contain items.");

                foreach (var item in dto.Items)
                {
                    var product = _products.GetAll().FirstOrDefault(p => p.Id == item.ProductId);

                    if (product.WarehouseCellId == null)
                    {
                        throw new InvalidOperationException("WareHouseCell must not be null.");

                    }
                }

                var sale = new Sale
                {
                    CustomerId = dto.CustomerId,
                    CashRegisterId = dto.CashRegisterId,
                    PaymentMethod = dto.PaymentMethod,
                    CreatedAt = DateTime.UtcNow
                };
                _sales.Create(sale);

                decimal total = 0m;

                foreach (var item in dto.Items)
                {
                    var product = _products.GetAll().FirstOrDefault(p => p.Id == item.ProductId);
                    ObjectValidator<Product>.CheckIsNotNull(product);

                    var cell = _warehouseCells.GetAll().First(c => c.Id == product.WarehouseCellId);
                    if (cell.Quantity < item.Quantity)
                        throw new InvalidOperationException($"Not enough stock for product {product.Name}");

                    // Скидка от активной акции
                    var discountPct = GetDiscountPercent(product.Id);
                    var priceAfterDiscount = item.UnitPrice * (100 - discountPct) / 100m;

                    var saleItem = new SaleItem
                    {
                        SaleId = sale.Id,
                        ProductId = item.ProductId,
                        SupplierId = item.SupplierId,
                        Quantity = item.Quantity,
                        UnitPrice = priceAfterDiscount,
                        UnitCost = item.UnitCost
                    };
                    _saleItems.Create(saleItem);

                    cell.Quantity -= item.Quantity;
                    _warehouseCells.Update(cell);

                    total += saleItem.Quantity * saleItem.UnitPrice;
                }

                sale.TotalAmaunt = total;
                _sales.Update(sale);

                return ResponseFactory<SaleDto>.CreateSuccessResponse(MapSale(sale));
            }
            catch (Exception ex)
            {
                return ResponseFactory<SaleDto>.CreateErrorResponse(ex);
            }
        }

        public IResponse<SaleDto> AddItems(int saleId, List<SaleItemCreateDto> items)
        {
            try
            {
                var sale = _sales.GetAll().FirstOrDefault(s => s.Id == saleId);
                ObjectValidator<Sale>.CheckIsNotNull(sale);

                foreach (var item in items)
                {
                    var product = _products.GetAll().First(p => p.Id == item.ProductId);
                    var cell = _warehouseCells.GetAll().First(c => c.Id == product.WarehouseCellId);
                    if (cell.Quantity < item.Quantity)
                        throw new InvalidOperationException($"Not enough stock for product {product.Name}");

                    var discountPct = GetDiscountPercent(product.Id);
                    var priceAfterDiscount = item.UnitPrice * (100 - discountPct) / 100m;

                    var saleItem = new SaleItem
                    {
                        SaleId = sale.Id,
                        ProductId = item.ProductId,
                        SupplierId = item.SupplierId,
                        Quantity = item.Quantity,
                        UnitPrice = priceAfterDiscount,
                        UnitCost = item.UnitCost
                    };
                    _saleItems.Create(saleItem);

                    cell.Quantity -= item.Quantity;
                    _warehouseCells.Update(cell);
                }

                sale.TotalAmaunt = _saleItems.GetAll()
                                  .Where(si => si.SaleId == sale.Id)
                                  .Sum(si => si.Quantity * si.UnitPrice);
                _sales.Update(sale);

                return ResponseFactory<SaleDto>.CreateSuccessResponse(MapSale(sale));
            }
            catch (Exception ex)
            {
                return ResponseFactory<SaleDto>.CreateErrorResponse(ex);
            }
        }

        public IResponse<TransactionDto> AddTransaction(TransactionCreateDto dto)
        {
            try
            {
                ObjectValidator<TransactionCreateDto>.CheckIsNotNull(dto);
                var sale = _sales.GetAll().FirstOrDefault(s => s.Id == dto.SaleId);
                ObjectValidator<Sale>.CheckIsNotNull(sale);

                var transaction = new Transaction
                {
                    SaleId = dto.SaleId,
                    CashRegisterId = dto.CashRegisterId,
                    Amount = dto.Amount,
                    Type = dto.Type,
                    CreatedAt = DateTime.UtcNow,
                    Note = dto.Note
                };
                _transactions.Create(transaction);

                var tDto = new TransactionDto
                {
                    Id = transaction.Id,
                    SaleId = transaction.SaleId,
                    CashRegisterId = transaction.CashRegisterId,
                    Amount = transaction.Amount,
                    Type = transaction.Type,
                    CreatedAt = transaction.CreatedAt,
                    Note = transaction.Note
                };
                return ResponseFactory<TransactionDto>.CreateSuccessResponse(tDto);
            }
            catch (Exception ex)
            {
                return ResponseFactory<TransactionDto>.CreateErrorResponse(ex);
            }
        }

        public IResponse<IEnumerable<TransactionDto>> GetTransactions(int saleId)
        {
            try
            {
                var list = _transactions.GetAll()
                            .Where(t => t.SaleId == saleId)
                            .Select(t => new TransactionDto
                            {
                                Id = t.Id,
                                SaleId = t.SaleId,
                                CashRegisterId = t.CashRegisterId,
                                Amount = t.Amount,
                                Type = t.Type,
                                CreatedAt = t.CreatedAt,
                                Note = t.Note
                            }).ToList();

                return ResponseFactory<IEnumerable<TransactionDto>>.CreateSuccessResponse(list);
            }
            catch (Exception ex)
            {
                return ResponseFactory<IEnumerable<TransactionDto>>.CreateErrorResponse(ex);
            }
        }

        private int GetDiscountPercent(int productId)
        {
            var now = DateTime.UtcNow;
            var active = _promotions.GetAll()
                         .Where(p => p.ProductId == productId
                                  && p.StartAt <= now
                                  && p.EndAt >= now)
                         .OrderByDescending(p => p.DiscountPercent)
                         .FirstOrDefault();
            return active?.DiscountPercent ?? 0;
        }

        private SaleDto MapSale(Sale sale)
        {
            var items = _saleItems.GetAll().Where(si => si.SaleId == sale.Id)
                        .Select(si => new SaleItemDto
                        {
                            Id = si.Id,
                            ProductId = si.ProductId,
                            SupplierId = si.SupplierId,
                            Quantity = si.Quantity,
                            UnitPrice = si.UnitPrice,
                            UnitCost = si.UnitCost
                        }).ToList();

            return new SaleDto
            {
                Id = sale.Id,
                CustomerId = sale.CustomerId,
                CashRegisterId = sale.CashRegisterId,
                PaymentMethod = sale.PaymentMethod,
                TotalAmount = sale.TotalAmaunt,
                CreatedAt = sale.CreatedAt,
                Items = items
            };
        }
    }
}