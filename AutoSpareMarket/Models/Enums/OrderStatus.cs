using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoSpareMarket.Domain.Models.Enums
{
    public enum OrderStatus
    {
        Pending = 1,
        Confirmed = 2,
        Canceled = 3,
        Failed = 4,
    }
}
