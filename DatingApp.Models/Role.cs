using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace DatingApp.Models
{
    public class Role: IdentityRole<int>
    {
        public virtual ICollection<UserRole> UserRoles { get; set; }
    }
}
