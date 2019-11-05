using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.DTO;
using DatingApp.API.Helpers;
using DatingApp.Data;
using DatingApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _repository;
        private readonly IMapper _mapper;
        private readonly Cloudinary _cloudinary;
        private IOptions<CloudinarySettings> _cloudinaryConfig;

        public PhotosController(IDatingRepository repository, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _repository = repository;
            _mapper = mapper;
            _cloudinaryConfig = cloudinaryConfig;

            var acc = new Account 
            (             
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(acc);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, PhotoForCreationDto photo)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var userFromRepo = await _repository.GetUser(userId);
            var file = photo.File;
            var uploadResult = new ImageUploadResult();
            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams() 
                    { 
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            photo.Url = uploadResult.Uri.ToString();
            photo.PublicId = uploadResult.PublicId;

            var newPhoto = _mapper.Map<Photo>(photo);
            newPhoto.IsMain = !userFromRepo.Photos.Any(x => x.IsMain);
            userFromRepo.Photos.Add(newPhoto);
            if (await _repository.SaveAll())
            {
                return Ok();
            }
            return BadRequest("Could not add the photo");
        }
    }
}