using AutoSpareMarket.APIModels.DTO.DTOs.Sales;
using AutoSpareMarket.APIModels.DTO.DTOs.Suppliers;
using AutoSpareMarket.APIModels.Response.Helpers;
using AutoSpareMarket.APIModels.Response.Interfaces;
using AutoSpareMarket.DAL.Repository.Intarfacec;
using AutoSpareMarket.Domain.Models.Entities;

namespace AutoSpareMarket.Service.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly IBaseRepository<SaleItem> _saleItems;
        private readonly IBaseRepository<Sale> _sales;
        private readonly IBaseRepository<Product> _products;
        private readonly IBaseRepository<SupplierProduct> _supplierProducts;
        private readonly IBaseRepository<Supplier> _suppliers;

        public AnalyticsService(IBaseRepository<SaleItem> saleItems,
                                IBaseRepository<Sale> sales,
                                IBaseRepository<Product> products,
                                IBaseRepository<SupplierProduct> supplierProducts,
                                IBaseRepository<Supplier> suppliers)
        {
            _saleItems = saleItems;
            _sales = sales;
            _products = products;
            _supplierProducts = supplierProducts;
            _suppliers = suppliers;
        }

        public IResponse<IEnumerable<SalesRankingItemDto>> GetTopProducts(int limit, DateTime? from, DateTime? to)
        {
            try
            {
                var f = from ?? DateTime.MinValue;
                var tt = to ?? DateTime.MaxValue;

                var query =
                    from si in _saleItems.GetAll()
                    join sale in _sales.GetAll() on si.SaleId equals sale.Id
                    join p in _products.GetAll() on si.ProductId equals p.Id
                    where sale.CreatedAt >= f && sale.CreatedAt <= tt
                    group new { si, p } by new { p.Id, p.Name } into g
                    let units = g.Sum(x => x.si.Quantity)
                    let revenue = g.Sum(x => x.si.Quantity * x.si.UnitPrice)
                    orderby units descending
                    select new SalesRankingItemDto
                    {
                        ProductId = g.Key.Id,
                        ProductName = g.Key.Name,
                        UnitsSold = units,
                        Revenue = revenue,
                        Rank = 0
                    };

                var list = query.Take(limit).ToList();
                for (int i = 0; i < list.Count; i++)
                    list[i].Rank = i + 1;

                return ResponseFactory<IEnumerable<SalesRankingItemDto>>.CreateSuccessResponse(list);
            }
            catch (Exception ex)
            {
                return ResponseFactory<IEnumerable<SalesRankingItemDto>>.CreateErrorResponse(ex);
            }
        }

        public IResponse<IEnumerable<SupplierDto>> GetCheapestSuppliers(int limit, int? productId)
        {
            try
            {
                var list = _suppliers.GetAll()
                            .Select(s => new
                            {
                                Supplier = s,
                                CheapestItem = s.SellItems
                                    .Where(si => !productId.HasValue || si.ProductId == productId.Value)
                                    .OrderBy(si => si.UnitPrice)
                                    .FirstOrDefault()
                            })
                            .Where(x => x.CheapestItem != null)
                            .OrderBy(x => x.CheapestItem!.UnitPrice)
                            .Take(limit)
                            .Select(x => new SupplierDto
                            {
                                Id = x.Supplier.Id,
                                ProductId = x.CheapestItem!.ProductId!.Value,
                                Name = x.Supplier.Name,
                                Country = x.Supplier.Country,
                                IsActive = x.Supplier.IsActive,
                                CountryInfo = x.Supplier.CountryInfo,
                                CreatedAt = x.Supplier.CreateAt
                            })
                            .ToList(); return ResponseFactory<IEnumerable<SupplierDto>>.CreateSuccessResponse(list);

            }
            catch (Exception ex)
            {
                return ResponseFactory<IEnumerable<SupplierDto>>.CreateErrorResponse(ex);
            }
        }

        public IResponse<SupplierShareDto> GetSupplierShare(int supplierId, DateTime? from, DateTime? to)
        {
            try
            {
                var f = from ?? DateTime.MinValue;
                var tt = to ?? DateTime.MaxValue;

                var supplierSales =
                    from si in _saleItems.GetAll()
                    join sale in _sales.GetAll() on si.SaleId equals sale.Id
                    where si.SupplierId == supplierId
                          && sale.CreatedAt >= f
                          && sale.CreatedAt <= tt
                    select new { si, sale };

                var totalSales =
                    from si in _saleItems.GetAll()
                    join sale in _sales.GetAll() on si.SaleId equals sale.Id
                    where sale.CreatedAt >= f && sale.CreatedAt <= tt
                    select new { si, sale };

                decimal supplierRevenue = supplierSales.Sum(x => x.si.Quantity * x.si.UnitPrice);
                int supplierUnits = supplierSales.Sum(x => x.si.Quantity);
                decimal supplierProfit = supplierSales.Sum(x => (x.si.UnitPrice - x.si.UnitCost) * x.si.Quantity);

                decimal totalRevenue = totalSales.Sum(x => x.si.Quantity * x.si.UnitPrice);
                decimal totalProfit = totalSales.Sum(x => (x.si.UnitPrice - x.si.UnitCost) * x.si.Quantity);

                var dto = new SupplierShareDto
                {
                    SupplierId = supplierId,
                    RevenueAmount = supplierRevenue,
                    UnitsSold = supplierUnits,
                    ProfitAmount = supplierProfit,
                    RevenueSharePercent = totalRevenue == 0 ? 0 : supplierRevenue / totalRevenue * 100m,
                    ProfitSharePercent = totalProfit == 0 ? 0 : supplierProfit / totalProfit * 100m
                };

                return ResponseFactory<SupplierShareDto>.CreateSuccessResponse(dto);
            }
            catch (Exception ex)
            {
                return ResponseFactory<SupplierShareDto>.CreateErrorResponse(ex);
            }
        }

        public IResponse<IEnumerable<SupplierRatingItemDto>> GetSupplierRating(string? month, DateTime? from, DateTime? to)
        {
            try
            {
                DateTime f, tt;
                if (!string.IsNullOrWhiteSpace(month))
                {
                    var parts = month.Split('-');
                    var y = int.Parse(parts[0]);
                    var m = int.Parse(parts[1]);
                    f = new DateTime(y, m, 1);
                    tt = f.AddMonths(1).AddTicks(-1);
                }
                else
                {
                    f = from ?? DateTime.MinValue;
                    tt = to ?? DateTime.MaxValue;
                }

                var query =
                    from si in _saleItems.GetAll()
                    join sale in _sales.GetAll() on si.SaleId equals sale.Id
                    join s in _suppliers.GetAll() on si.SupplierId equals s.Id
                    where sale.CreatedAt >= f && sale.CreatedAt <= tt
                    group new { si, s } by new { s.Id, s.Name } into g
                    let revenue = g.Sum(x => x.si.Quantity * x.si.UnitPrice)
                    let units = g.Sum(x => x.si.Quantity)
                    let profit = g.Sum(x => (x.si.UnitPrice - x.si.UnitCost) * x.si.Quantity)
                    orderby profit descending
                    select new SupplierRatingItemDto
                    {
                        SupplierId = g.Key.Id,
                        SupplierName = g.Key.Name,
                        TotalRevenue = revenue,
                        UnitsSold = units,
                        TotalProfit = profit,
                        Rank = 0
                    };

                var list = query.ToList();
                for (int i = 0; i < list.Count; i++)
                    list[i].Rank = i + 1;

                return ResponseFactory<IEnumerable<SupplierRatingItemDto>>.CreateSuccessResponse(list);
            }
            catch (Exception ex)
            {
                return ResponseFactory<IEnumerable<SupplierRatingItemDto>>.CreateErrorResponse(ex);
            }
        }

        public IResponse<IEnumerable<SalesRankingItemDto>> GetProductRating(string? month, DateTime? from, DateTime? to)
        {
            return GetTopProducts(int.MaxValue, from, to);
        }
    }
}