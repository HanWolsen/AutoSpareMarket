namespace AutoSpareMarket.Validation
{
    public static class ObjectValidator<T>
    {
        public static void CheckIsNotNull(T modelObject)
        {
            if (modelObject == null)
            {
                throw new ArgumentNullException(nameof(modelObject), "Объект не должен быть Null");
            }
        }
    }
}
