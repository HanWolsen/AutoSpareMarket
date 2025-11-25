using AutoSpareMarket.APIModels.DTO.BaseDTOs;
using AutoSpareMarket.APIModels.DTO.DTOs.Transactions;

namespace AutoSpareMarket.APIModels.DTO.DTOs.CashRegisters
{
    public class CashRegisterReportDto : BaseDTO
    {
        public int CashRegisterId { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public decimal TotalSalesAmount { get; set; }
        public decimal TotalRefunds { get; set; }
        public int TransactionsCount { get; set; }
        public List<TransactionDto> Transactions { get; set; } = new();
    }

}
