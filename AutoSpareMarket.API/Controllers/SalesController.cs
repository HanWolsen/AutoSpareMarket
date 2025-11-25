using AutoSpareMarket.APIModels.DTO.DTOs.SaleItems;
using AutoSpareMarket.APIModels.DTO.DTOs.Sales;
using AutoSpareMarket.APIModels.DTO.DTOs.Transactions;
using AutoSpareMarket.Domain.Models.Entities;
using AutoSpareMarket.Service.Interfaces;
using AutoSpareMarket.Service.Service.Intarfaces;
using Microsoft.AspNetCore.Mvc;

namespace AutoSpareMarket.API.Controllers
{
    [Route("api/v1/sales")]
    public class SalesController : BaseApiController
    {
        private readonly IBaseService<Sale> _baseService;
        private readonly ISaleExtendedService _extendedService;
        private readonly IBaseService<Transaction> _transactionBaseService;

        public SalesController(IBaseService<Sale> baseService,
                               ISaleExtendedService extendedService,
                               IBaseService<Transaction> transactionBaseService)
        {
            _baseService = baseService;
            _extendedService = extendedService;
            _transactionBaseService = transactionBaseService;
        }

        [HttpPost]
        public ActionResult Create([FromBody] SaleCreateDto dto)
            => HandleResponse(_extendedService.CreateSale(dto));

        [HttpGet]
        public ActionResult GetAll()
            => HandleResponse(_baseService.GetAll());

        [HttpGet("{id:int}")]
        public ActionResult GetById(int id)
            => HandleResponse(_baseService.GetById(id));

        [HttpDelete("{id:int}")]
        public ActionResult Delete(int id)
            => HandleBoolResponse(_baseService.DeleteById(id));

        [HttpPost("{id:int}/add-items")]
        public ActionResult AddItems(int id, [FromBody] List<SaleItemCreateDto> items)
            => HandleResponse(_extendedService.AddItems(id, items));

        [HttpPost("{id:int}/transactions")]
        public ActionResult AddTransaction(int id, [FromBody] TransactionCreateDto dto)
        {
            dto.SaleId = id;
            return HandleResponse(_extendedService.AddTransaction(dto));
        }

        [HttpGet("{id:int}/transactions")]
        public ActionResult GetTransactions(int id)
            => HandleResponse(_extendedService.GetTransactions(id));
    }
}