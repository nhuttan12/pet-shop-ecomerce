import { ImageService } from '@images/image.service';
import { ErrorMessage } from '@messages/error.messages';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { buildPaginationMeta } from '@pagination/build-pagination-meta';
import { PaginationResponse } from '@pagination/pagination-response';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { GetAllUsersResponseDTO } from '@user/dto/get-all-user-response.dto';
import { UserUpdateDTO } from '@user/dto/update-user.dto';
import { UserDetail } from '@user/entites/user-details.entity';
import { User } from '@user/entites/users.entity';
import { UserStatus } from '@user/enums/user-status.enum';
import { UserErrorMessage } from '@user/messages/user.error-messages';
import { UserMessageLog } from '@user/messages/user.messages-log';
import { plainToInstance } from 'class-transformer';
import { DataSource, In, Like, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly imageService: ImageService,
  ) {}

  async findUserListByID(
    id: number,
    skip: number,
    take: number,
  ): Promise<PaginationResponse<User>> {
    // 1. Convert id from number to string
    const idString: string = id.toString();

    // 2. Use LIKE operator to get users
    const [userList, totalUsers] = await this.userRepo
      .createQueryBuilder('user')
      .where('CAST(user.id AS CHAR) like :pattern', {
        pattern: `%${idString}%`,
      })
      .getManyAndCount();

    // 3. Calculate current page
    const currentPage: number = Math.floor(skip / take) + 1;

    // 4. Calculate meta
    const meta = buildPaginationMeta(totalUsers, currentPage, take);

    return {
      data: userList,
      meta,
    };
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id }, relations: { role: true } });
  }

  async getUserByName(name: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { name } });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email }, relations: ['role'] });
  }

  async getUserByUserName(username: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username }, relations: ['role'] });
  }

  async findUsersByUsername(username: string): Promise<User[]> {
    return this.userRepo.find({ where: { username } });
  }

  async findUsersByName(
    name: string,
    take: number,
    skip: number,
  ): Promise<PaginationResponse<User>> {
    // 1. Get user list and total users
    const [userList, totalUsers] = await this.userRepo.findAndCount({
      where: { name: Like(`%${name}%`) },
      take,
      skip,
    });

    // 2. Calculate current page
    const currentPage: number = Math.floor(skip / take) + 1;

    // 3. Calculate meta
    const meta = buildPaginationMeta(totalUsers, currentPage, take);

    return {
      data: userList,
      meta,
    };
  }

  async findUsersByEmail(email: string): Promise<User[]> {
    return this.userRepo.findBy({ email });
  }

  async findUserForAdmin(
    filters: Partial<{
      name?: string;
      username?: string;
      email?: string;
      status?: UserStatus;
    }>,
    take: number = 10,
    skip: number = 0,
    sortField: keyof User = 'id',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<PaginationResponse<GetAllUsersResponseDTO>> {
    const query = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userDetail', 'userDetail');

    if (filters.name) {
      query.andWhere('user.name LIKE :name', { name: `%${filters.name}%` });
    }

    if (filters.username) {
      query.andWhere('user.name LIKE :username', {
        username: `%${filters.username}%`,
      });
    }

    if (filters.email) {
      query.andWhere('user.email LIKE :email', { email: `%${filters.email}%` });
    }

    if (filters.status !== undefined) {
      query.andWhere('user.status = :status', { status: filters.status });
    }

    // Phân trang
    query.take(take).skip(skip);

    // Sắp xếp
    query.orderBy(`user.${sortField}`, sortOrder);

    const totalItems = await query.getCount();

    // Thực thi truy vấn
    const users = await query.getMany();

    const data = plainToInstance(GetAllUsersResponseDTO, users, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    const meta = buildPaginationMeta(
      totalItems,
      Math.floor(skip / take) + 1,
      take,
    );

    return {
      data,
      meta,
    };
  }

  async insertUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.dataSource.transaction(async (manager) => {
      const user = manager.create(User, {
        username: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.hashedPassword,
        role: { id: createUserDto.roleId },
        status: createUserDto.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const savedUser = await manager.save(user);

      if (!savedUser?.id) {
        this.logger.error(UserMessageLog.USER_CREATED_FAILED);
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.debug(`User created id: ${savedUser.id}`);

      savedUser.name = `Người dùng ${savedUser.id}`;
      await manager.save(User, savedUser);

      this.logger.verbose(
        `${UserMessageLog.INSERT_DEFAULT_IMAGE}: ${savedUser.id}`,
      );

      const userDetail = manager.create(UserDetail, {
        id: savedUser.id,
        imageId: 1,
      });

      await manager.save(UserDetail, userDetail);

      const createdUser: User | null = await manager.findOne(User, {
        where: { id: savedUser.id },
        relations: ['role', 'userDetail'],
      });

      if (!createdUser) {
        this.logger.debug(UserMessageLog.USER_NOT_FOUND_AFTER_CREATED);
        throw new InternalServerErrorException(
          UserErrorMessage.USER_NOT_FOUND_AFTER_CREATED,
        );
      }

      return createdUser;
    });
  }

  async updateUser(userUpdateDTO: UserUpdateDTO): Promise<boolean> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const userUpdateResult: UpdateResult = await manager.update(
          User,
          userUpdateDTO.id,
          {
            name: userUpdateDTO.name,
            email: userUpdateDTO.email,
            updatedAt: new Date(),
          },
        );

        const userDetailUpdateResult: UpdateResult = await manager.update(
          UserDetail,
          userUpdateDTO.id,
          {
            phone: userUpdateDTO.phone,
            // adress: userUpdateDTO.address,
            birhDate: userUpdateDTO.birthDate,
            gender: userUpdateDTO.gender,
          },
        );

        if (
          userUpdateResult.affected !== 1 ||
          userDetailUpdateResult.affected !== 1
        ) {
          return false;
        }

        return true;
      });
    } catch (error) {
      this.logger.error('Error', error);
      throw error;
    }
  }

  async updatePassword(id: number, password: string) {
    return await this.dataSource.transaction(async (manager) => {
      await manager.update(User, id, { password, updatedAt: new Date() });
    });
  }

  async findUsersById(ids: number[]): Promise<User[]> {
    return await this.userRepo.find({ where: { id: In(ids) } });
  }

  async getUserWithUserDetailAndRole(userID: number) {
    return await this.dataSource.transaction(async (manager) => {
      return await manager
        .createQueryBuilder(User, 'user')
        .leftJoinAndSelect('user.userDetail', 'userDetail')
        .leftJoinAndSelect('user.role', 'role')
        .where('user.id = :id', { id: userID })
        .getOne();
    });
  }

  async getUserProfileByUserID(userID: number): Promise<User | null> {
    try {
      return this.userRepo.findOne({
        where: {
          id: userID,
        },
        relations: {
          userDetail: true,
          role: true,
        },
      });
    } catch (error) {
      this.logger.error('Error', error);
      throw error;
    }
  }
}
