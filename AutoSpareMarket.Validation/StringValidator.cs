namespace AutoSpareMarket.Validation
{
    public static class StringValidator
    {
        public static void CheckIsNotNull(string text)
        {
            if (string.IsNullOrEmpty(text))
            {
                throw new ArgumentNullException(nameof(text), "Параметр не должен быть Null");
            }
            
        }
    }
}
