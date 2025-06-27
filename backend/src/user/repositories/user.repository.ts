import { ErrorMessage, Image, ImageService } from '@common';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateUserDto,
  GetAllUsersResponseDTO,
  User,
  UserDetail,
  UserErrorMessage,
  UserMessageLog,
  UserStatus,
  UserUpdateDTO,
} from '@user';
import { plainToInstance } from 'class-transformer';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly imageService: ImageService,
  ) {}

  async getUserById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
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

  async findUsers(
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
  ): Promise<User[]> {
    const qb = this.userRepo.createQueryBuilder('user');

    // Tìm kiếm LIKE cho các trường chuỗi
    if (filters.name) {
      qb.andWhere('user.name LIKE :name', { name: `%${filters.name}%` });
    }

    if (filters.username) {
      qb.andWhere('user.username LIKE :username', {
        username: `%${filters.username}%`,
      });
    }

    if (filters.email) {
      qb.andWhere('user.email LIKE :email', { email: `%${filters.email}%` });
    }

    // Lọc chính xác theo status nếu có
    if (filters.status !== undefined) {
      qb.andWhere('user.status = :status', { status: filters.status });
    }

    // Sắp xếp
    qb.orderBy(`user.${sortField}`, sortOrder);

    // Phân trang
    if (take !== undefined) {
      qb.take(take);
    }
    if (skip !== undefined) {
      qb.skip(skip);
    }

    return qb.getMany();
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
  ): Promise<GetAllUsersResponseDTO[]> {
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

    // Thực thi truy vấn
    const users = await query.getMany();

    return plainToInstance(GetAllUsersResponseDTO, users, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
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

  async updateUser(userUpdateDTO: UserUpdateDTO): Promise<User> {
    return await this.dataSource.transaction(async (manager) => {
      const user: User | null = await this.getUserById(userUpdateDTO.id);

      if (!user) {
        this.logger.error(UserMessageLog.USER_NOT_FOUND);
        throw new NotFoundException(UserErrorMessage.USER_NOT_FOUND);
      }

      const userWithEmail: User | null = await this.getUserByEmail(
        userUpdateDTO.email,
      );

      if (userWithEmail) {
        this.logger.error(UserMessageLog.USER_EMAIL_EXIST);
        throw new BadRequestException(UserErrorMessage.USER_EMAIL_EXIST);
      }

      await manager.update(User, userUpdateDTO.id, {
        name: userUpdateDTO.name,
        email: userUpdateDTO.email,
        updatedAt: new Date(),
      });

      const newImage: Image = await this.imageService.saveImage(
        userUpdateDTO.image,
      );

      await manager.update(UserDetail, userUpdateDTO.id, {
        phone: userUpdateDTO.phone,
        adresss: userUpdateDTO.address,
      });

      await this.imageService.updateImageForSubsject(
        manager,
        userUpdateDTO.id,
        'user',
        newImage.url,
        newImage.type,
        newImage.folder,
      );

      const updatedUser: User | null = await manager.findOne(User, {
        where: { id: userUpdateDTO.id },
        relations: ['userDetail', 'role'],
      });

      if (!updatedUser) {
        this.logger.error(UserMessageLog.USER_NOT_FOUND_AFTER_UDPATED);
        throw new InternalServerErrorException(
          UserErrorMessage.USER_NOT_FOUND_AFTER_UDPATED,
        );
      }

      return updatedUser;
    });
  }

  async updatePassword(id: number, password: string) {
    return await this.dataSource.transaction(async (manager) => {
      await manager.update(User, id, { password, updatedAt: new Date() });
    });
  }
}
