using AutoSpareMarket.APIModels.DTO.DTOs.CashRegisters;
using AutoSpareMarket.APIModels.Response.Interfaces;

namespace AutoSpareMarket.Service.Interfaces
{
    public interface ICashRegisterExtendedService
    {
        IResponse<CashRegisterReportDto> GetReport(int registerId, DateTime? from, DateTime? to);
    }
}