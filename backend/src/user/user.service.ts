import { PaginationResponse, UtilityService } from '@common';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserDto,
  GetAllUsersResponseDTO,
  UserErrorMessage,
  UserMessageLog,
  UserStatus,
  UserUpdateDTO,
} from '@user';
import { User } from 'user/entites';
import { UserRepository } from 'user/repositories/user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private utilityService: UtilityService,
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

  async findUserByName(name: string): Promise<User[]> {
    return await this.userRepo.findUsersByName(name);
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

  async updateUser(userUpdateDTO: UserUpdateDTO): Promise<User> {
    return await this.userRepo.updateUser(userUpdateDTO);
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
