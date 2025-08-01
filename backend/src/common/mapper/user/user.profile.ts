import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { UserProfileResponseDTO } from '@user/dto/user-profile-response.dto';
import { UserResponseDTO } from '@user/dto/user-reseponse.dto';
import { User } from '@user/entites/users.entity';

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      this.userToUserProfileResponse(mapper);
      this.userToUserResponse(mapper);
    };
  }

  private userToUserProfileResponse(mapper: Mapper) {
    createMap(
      mapper,
      User,
      UserProfileResponseDTO,
      forMember(
        (dest: UserProfileResponseDTO) => dest.id,
        mapFrom((src: User) => src.id),
      ),
      forMember(
        (dest: UserProfileResponseDTO) => dest.phone,
        mapFrom((src: User) => src.userDetail.phone),
      ),
      forMember(
        (dest: UserProfileResponseDTO) => dest.gender,
        mapFrom((src: User) => src.userDetail.gender),
      ),
      forMember(
        (dest: UserProfileResponseDTO) => dest.birthDate,
        mapFrom((src: User) => src.userDetail.birhDate),
      ),
    );
  }

  private userToUserResponse(mapper: Mapper) {
    createMap(
      mapper,
      User,
      UserResponseDTO,
      forMember(
        (dest: UserResponseDTO) => dest.id,
        mapFrom((src: User) => src.id),
      ),
      forMember(
        (dest: UserResponseDTO) => dest.roleName,
        mapFrom((src: User) => src.role.name),
      ),
    );
  }
}
