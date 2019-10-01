using DatingApp.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace DatingApp.Data
{
    public class Seed
    {
        public static void SeedUsers(DataContext context)
        {
            if (!context.Users.Any())
            {
                var userData = File.ReadAllText("../DatingApp.Data/UserSeedData.json");
                if (!string.IsNullOrEmpty(userData))
                {
                    var users = JsonConvert.DeserializeObject<List<User>>(userData);
                    foreach (var user in users)
                    {
                        byte[] passwordHash, passwordSalt;
                        CreatePasswordHash("password", out passwordHash, out passwordSalt);
                        user.PasswordHash = passwordHash;
                        user.PasswordSalt = passwordSalt;
                        user.UserName = user.UserName.ToLower();
                        context.Users.Add(user);
                    }
                    context.SaveChanges();
                }
            }
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }
    }
}
