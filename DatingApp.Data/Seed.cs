﻿using DatingApp.Models;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace DatingApp.Data
{
    public class Seed
    {
        public static void SeedUsers(UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            if (!userManager.Users.Any())
            {
                var userData = File.ReadAllText("../DatingApp.Data/UserSeedData.json");
                if (!string.IsNullOrEmpty(userData))
                {
                    var users = JsonConvert.DeserializeObject<List<User>>(userData);
                    var roles = new List<Role>
                    { 
                        new Role { Name = "Admin" },
                        new Role { Name = "Member" },
                        new Role { Name = "Moderator" },
                        new Role { Name = "VIP" }
                    };

                    foreach (var role in roles)
                    {
                        roleManager.CreateAsync(role).Wait();
                    }

                    foreach (var user in users)
                    {
                        user.Photos.SingleOrDefault().IsApproved = true; ;
                        userManager.CreateAsync(user, "password").Wait();
                        userManager.AddToRoleAsync(user, "Member").Wait();
                    }

                    var adminUser = new User
                    {
                        UserName = "Admin"
                    };

                    var result = userManager.CreateAsync(adminUser, "password").Result;
                    if (result.Succeeded)
                    {
                        var admin = userManager.FindByNameAsync(adminUser.UserName).Result;
                        userManager.AddToRolesAsync(admin, new [] { "Admin", "Moderator" });
                    }
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
