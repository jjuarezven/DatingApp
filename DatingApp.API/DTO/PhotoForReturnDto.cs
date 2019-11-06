using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.DTO
{
    public class PhotoForReturnDto : PhotosForDetailedDto
    {
        public string PublicId { get; set; }
    }
}
