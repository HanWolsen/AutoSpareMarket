using AutoSpareMarket.APIModels.DTO.DTOs.CashRegisters;
using AutoSpareMarket.APIModels.DTO.DTOs.Transactions;
using AutoSpareMarket.APIModels.Response.Helpers;
using AutoSpareMarket.APIModels.Response.Interfaces;
using AutoSpareMarket.DAL.Repository.Intarfacec;
using AutoSpareMarket.Service.Interfaces;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Domain.Models.Enums;

namespace AutoSpareMarket.Service.Services
{
    public class CashRegisterExtendedService : ICashRegisterExtendedService
    {
        private readonly IBaseRepository<Transaction> _transactions;

        public CashRegisterExtendedService(IBaseRepository<Transaction> transactions)
        {
            _transactions = transactions;
        }

        public IResponse<CashRegisterReportDto> GetReport(int registerId, DateTime? from, DateTime? to)
        {
            try
            {
                var f = from ?? DateTime.MinValue;
                var t = to ?? DateTime.MaxValue;

                var tx = _transactions.GetAll()
                          .Where(tr => tr.CashRegisterId == registerId
                                    && tr.CreatedAt >= f
                                    && tr.CreatedAt <= t)
                          .Select(tr => new TransactionDto
                          {
                              Id = tr.Id,
                              SaleId = tr.SaleId,
                              CashRegisterId = tr.CashRegisterId,
                              Amount = tr.Amount,
                              Type = tr.Type,
                              CreatedAt = tr.CreatedAt,
                              Note = tr.Note
                          }).ToList();

                var totalSales = tx.Where(x => x.Type == TransactionType.Payment).Sum(x => x.Amount);
                var totalRefunds = tx.Where(x => x.Type == TransactionType.Refund).Sum(x => x.Amount);

                var dto = new CashRegisterReportDto
                {
                    CashRegisterId = registerId,
                    From = f,
                    To = t,
                    TotalSalesAmount = totalSales,
                    TotalRefunds = totalRefunds,
                    TransactionsCount = tx.Count,
                    Transactions = tx
                };

                return ResponseFactory<CashRegisterReportDto>.CreateSuccessResponse(dto);
            }
            catch (Exception ex)
            {
                return ResponseFactory<CashRegisterReportDto>.CreateErrorResponse(ex);
            }
        }
    }
}