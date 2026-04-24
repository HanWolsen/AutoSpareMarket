namespace AutoSpareMarket.Service.Helpers.Constans
{
    public class AdminInfo
    {
        public static string AdminName = "Admin";
        public static int Id = 0;
        public static string UserName = AdminName;
        public static string Password = "Password1!@";
        public static string PhoneNumber = "+7 (123) 456-78-90";
        public static string Email = "admin@admin.com";
        public static string FirstName = AdminName;
        public static string MiddleName = AdminName;
        public static string LastName = AdminName;
        public static string NormalizedUserName = AdminName.Normalize();
        public static string NormalizedEmail = Email.Normalize();
    }
}
