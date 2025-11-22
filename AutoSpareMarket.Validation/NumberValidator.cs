namespace AutoSpareMarket.Validation
{
    public static class NumberValidator<T> where T : struct, IComparable, IConvertible
    {
        public static void IsNotZero(T number)
        {
            if(number.CompareTo(default(T)) == 0)
            {
                throw new ArgumentException("Значение не может быть ровго нулю", nameof(number));
            }
        }
    }
}