using AutoMapper;
using DatingApp.API.DTO;
using DatingApp.Models;
using System.Linq;

namespace DatingApp.API.Helpers
{
    public class AutomapperProfiles : Profile
    {
        public AutomapperProfiles()
        {
            CreateMap<User, UserForListDto>()
                .ForMember(dest => dest.PhotoUrl, options =>
                    options.MapFrom(source => source.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(dest => dest.Age, options =>
                    options.MapFrom(source => source.DateOfBirth.CalculateAge()));
            CreateMap<User, UserForDetailedDto>()
                .ForMember(dest => dest.PhotoUrl, options =>
                    options.MapFrom(source => source.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(dest => dest.Age, options =>
                    options.MapFrom(source => source.DateOfBirth.CalculateAge()));
            CreateMap<Photo, PhotosForDetailedDto>();
            CreateMap<UserForUpdateDto, User>();
            CreateMap<Photo, PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto, Photo>();
            CreateMap<UserForRegisterDto, User>();
        }
    }
}
