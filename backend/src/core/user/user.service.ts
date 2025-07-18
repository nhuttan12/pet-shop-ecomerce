import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Image } from '@images/entites/images.entity';
import { ImageType } from '@images/enums/image-type.enum';
import { SubjectType } from '@images/enums/subject-type.enum';
import { ImageService } from '@images/image.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PaginationResponse } from '@pagination/pagination-response';
import { UtilityService } from '@services/utility.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { FindUserListById } from '@user/dto/find-user-list-by-id-request.dto';
import { FindUserByNameRequest } from '@user/dto/find-user-list-by-name-request.dto';
import { GetAllUsersResponseDTO } from '@user/dto/get-all-user-response.dto';
import { GetUserProfileByUserIdRequestDto } from '@user/dto/get-user-profile-by-user-id-request.dto';
import { UserUpdateDTO } from '@user/dto/update-user.dto';
import { UserProfileResponseDTO } from '@user/dto/user-profile-response.dto';
import { UserResponseDTO } from '@user/dto/user-reseponse.dto';
import { User } from '@user/entites/users.entity';
import { UserStatus } from '@user/enums/user-status.enum';
import { UserErrorMessage } from '@user/messages/user.error-messages';
import { UserMessageLog } from '@user/messages/user.messages-log';
import { UserRepository } from '@user/repositories/user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly imageService: ImageService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly utilityService: UtilityService,
    private readonly userRepo: UserRepository,
  ) {}

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepo.getUserById(id);

    if (!user) {
      this.logger.error(UserMessageLog.USER_NOT_FOUND);
      throw new NotFoundException(UserErrorMessage.USER_NOT_FOUND);
    }

    return user;
  }

  async findUserListByID(
    request: FindUserListById,
  ): Promise<PaginationResponse<UserResponseDTO>> {
    // 1. Get take and skip for pagination
    const { take, skip } = this.utilityService.getPagination(
      request.page,
      request.limit,
    );
    this.logger.debug('Pagination - skip: ', skip, 'take: ', take);

    // 2. Get user list by user ID
    const user: PaginationResponse<User> = await this.userRepo.findUserListByID(
      request.id,
      take,
      skip,
    );

    // 3. Map user to user response
    const userResponse: UserResponseDTO[] = this.mapper.mapArray(
      user.data,
      User,
      UserResponseDTO,
    );

    // 3. Return user list
    return {
      data: userResponse,
      meta: user.meta,
    };
  }

  async findUserByName(
    request: FindUserByNameRequest,
  ): Promise<PaginationResponse<UserResponseDTO>> {
    // 1. Get take and skip for pagination
    const { take, skip } = this.utilityService.getPagination(
      request.page,
      request.limit,
    );
    this.logger.debug('Pagination - skip: ', skip, 'take: ', take);

    // 2. Get user list and pagination response
    const user: PaginationResponse<User> = await this.userRepo.findUsersByName(
      request.name,
      take,
      skip,
    );
    this.utilityService.logPretty('User list', user.data);
    this.utilityService.logPretty('Meta', user.meta);

    // 3. Map user to user response
    const userResponse: UserResponseDTO[] = this.mapper.mapArray(
      user.data,
      User,
      UserResponseDTO,
    );

    // 4. Return user list and meta
    return {
      data: userResponse,
      meta: user.meta,
    };
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.userRepo.getUserByUserName(username);

    if (!user) {
      this.logger.error(UserMessageLog.USER_NOT_FOUND);
      throw new NotFoundException(UserErrorMessage.USER_NOT_FOUND);
    }

    return user;
  }

  async findUserByUsername(username: string): Promise<User[]> {
    return await this.userRepo.findUsersByUsername(username);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepo.getUserByEmail(email);
  }

  async findUserByEmail(email: string): Promise<User[]> {
    return await this.userRepo.findUsersByEmail(email);
  }

  async findUserForAdmin(
    filters: Partial<{
      name?: string;
      username?: string;
      email?: string;
      status?: UserStatus;
    }>,
    take?: number,
    skip?: number,
    sortField: keyof User = 'id',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<PaginationResponse<GetAllUsersResponseDTO>> {
    return await this.userRepo.findUserForAdmin(
      filters,
      take,
      skip,
      sortField,
      sortOrder,
    );
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepo.insertUser(createUserDto);
  }

  async updateUser(
    userUpdateDTO: UserUpdateDTO,
  ): Promise<UserProfileResponseDTO> {
    // 1. Get user by user ID
    const user: User | null = await this.getUserById(userUpdateDTO.id);
    this.utilityService.logPretty('Get user by user ID', user);

    // 2. Check if user exist
    if (!user) {
      this.logger.error(UserMessageLog.USER_NOT_FOUND);
      throw new NotFoundException(UserErrorMessage.USER_NOT_FOUND);
    }

    // 3. Get user by email
    const userWithEmail: User | null = await this.getUserByEmail(
      userUpdateDTO.email,
    );
    this.utilityService.logPretty('Get user by email', userWithEmail);

    // 4. Check if user exist with email that email, throw error email already exist
    if (userWithEmail?.id !== user.id) {
      this.logger.error(UserMessageLog.USER_EMAIL_EXIST);
      throw new BadRequestException(UserErrorMessage.USER_EMAIL_EXIST);
    }

    // 5. Update user
    const updatedUserResult: boolean =
      await this.userRepo.updateUser(userUpdateDTO);
    this.utilityService.logPretty('Update user', updatedUserResult);

    // 6. Check user update result
    if (!updatedUserResult) {
      this.logger.error(UserMessageLog.USER_UPDATED_FAILED);
      throw new InternalServerErrorException(
        UserErrorMessage.USER_UPDATED_FAILED,
      );
    }

    // 7. Update user image
    // const updatedImage: Image = await this.imageService.updateImageForSubsject(
    //   userUpdateDTO.id,
    //   SubjectType.USER,
    //   newImage.url,
    //   newImage.type,
    //   newImage.folder,
    // );
    // this.utilityService.logPretty('Save new image to database', newImage);

    // 8. Check image saving result
    // if (!updatedImage) {
    //   this.logger.error(ImageMessageLog.CANNOT_UPDATE_IMAGE);
    //   throw new InternalServerErrorException(
    //     ImageErrorMessage.CANNOT_UPDATE_IMAGE,
    //   );
    // }

    // 9. Get user profile after updated
    const updatedUser: UserProfileResponseDTO =
      await this.getUserProfileByUserID({
        userID: userUpdateDTO.id,
      });

    // 10. Check user profile after updated
    if (!updatedUser) {
      this.logger.error(UserMessageLog.USER_NOT_FOUND_AFTER_UDPATED);
      throw new InternalServerErrorException(
        UserErrorMessage.USER_NOT_FOUND_AFTER_UDPATED,
      );
    }

    // 11. Return user after updated
    return updatedUser;
  }

  async getUserProfileByUserID(
    request: GetUserProfileByUserIdRequestDto,
  ): Promise<UserProfileResponseDTO> {
    // 1. Get user profile by user ID
    const user: User | null = await this.userRepo.getUserProfileByUserID(
      request.userID,
    );
    this.utilityService.logPretty('Get user profile by user ID', user);

    // 2. Check user is exist
    if (!user) {
      this.logger.error(UserMessageLog.USER_NOT_FOUND);
      throw new NotFoundException(UserErrorMessage.USER_NOT_FOUND);
    }

    // 3. Map user to user profile
    const userProfile: UserProfileResponseDTO = this.mapper.map(
      user,
      User,
      UserProfileResponseDTO,
    );
    this.utilityService.logPretty('Map user to user profile', userProfile);

    // 4. Get user profile image base on user ID
    const image: Image =
      await this.imageService.getImageBySubjectIdAndSubjectType(
        request.userID,
        SubjectType.USER,
        ImageType.AVATAR,
      );
    this.utilityService.logPretty(
      'Get user profile image base on user ID',
      image,
    );

    // 5. Set user profile image
    userProfile.avatar = image.url;
    this.utilityService.logPretty('Set user profile image', userProfile.avatar);

    // 6. Return user profile
    return userProfile;
  }

  async updatePassword(id: number, password: string): Promise<User> {
    try {
      await this.userRepo.updatePassword(id, password);

      const user = await this.userRepo.getUserById(id);

      if (!user) {
        this.logger.error(UserMessageLog.USER_NOT_FOUND_AFTER_UDPATED);
        throw new InternalServerErrorException(
          UserErrorMessage.USER_NOT_FOUND_AFTER_UDPATED,
        );
      }

      return user;
    } catch (error) {
      this.logger.error(`Error: ${error}`);
      throw error;
    } finally {
      this.logger.verbose(`User with ${id} updated`);
    }
  }

  async findUsersById(ids: number[]): Promise<User[]> {
    return await this.userRepo.findUsersById(ids);
  }
}
