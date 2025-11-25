using AutoSpareMarket.APIModels.DTO.DTOs.SaleItems;
using AutoSpareMarket.APIModels.DTO.DTOs.Sales;
using AutoSpareMarket.APIModels.DTO.DTOs.Transactions;
using AutoSpareMarket.APIModels.Response.Interfaces;

namespace AutoSpareMarket.Service.Interfaces
{
    public interface ISaleExtendedService
    {
        IResponse<SaleDto> CreateSale(SaleCreateDto dto);
        IResponse<SaleDto> AddItems(int saleId, List<SaleItemCreateDto> items);
        IResponse<TransactionDto> AddTransaction(TransactionCreateDto dto);
        IResponse<IEnumerable<TransactionDto>> GetTransactions(int saleId);
    }
}