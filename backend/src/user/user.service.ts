import { UtilityService, ErrorMessage, MessageLog } from '@common';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { GetAllUsersResponseDTO, CreateUserDto, UserUpdateDTO } from '@user';
import { User } from 'user/entites';
import { UserRepository } from 'user/repositories/user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private utilityService: UtilityService,
    private readonly userRepo: UserRepository,
  ) {}

  async getUserById(id: number): Promise<User | null> {
    return this.userRepo.getUserById(id);
  }

  async findUserByName(name: string): Promise<User[]> {
    return await this.userRepo.findUsers({ name });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await this.userRepo.getUserByUserName(username);
  }

  async findUserByUsername(username: string): Promise<User[]> {
    return await this.userRepo.findUsers({ username });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepo.getUserByEmail(email);
  }

  async findUserByEmail(email: string): Promise<User[]> {
    return await this.userRepo.findUsers({ email });
  }

  async getAllUsers(
    limit: number,
    offset: number,
  ): Promise<GetAllUsersResponseDTO[]> {
    const { skip, take } = this.utilityService.getPagination(offset, limit);

    const user: User[] = await this.userRepo.findUsers({}, take, skip);

    const result: GetAllUsersResponseDTO[] = user.map(
      (u): GetAllUsersResponseDTO => ({
        id: u.id,
        username: u.username,
        password: u.password,
        name: u.name!,
        email: u.email,
        role: '',
        status: u.status,
        phone: '',
        adresss: '',
        image: '',
      }),
    );

    this.logger.debug(`User list: ${JSON.stringify(result)}`);

    return result;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    this.logger.debug('User information to create', createUserDto);

    const [userCreatedId]: { id: number }[] = await this.db.transaction(
      async (tx): Promise<{ id: number }[]> => {
        return await tx
          .insert(users)
          .values({
            username: createUserDto.username,
            email: createUserDto.email,
            password: createUserDto.hashedPassword,
            roleId: createUserDto.roleId,
            status: createUserDto.status,
            created_at: new Date(),
            updated_at: new Date(),
          })
          .$returningId();
      },
    );

    this.logger.debug('User created id', userCreatedId);

    if (!userCreatedId) {
      this.logger.error(MessageLog.USER_NOT_FOUND);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    await this.db.transaction(async (tx) => {
      return await tx
        .update(users)
        .set({
          name: `Người dùng ${userCreatedId.id}`,
        })
        .where(eq(users.id, userCreatedId.id));
    });

    this.logger.verbose(
      `Inser deffault image to user detail with id: ${userCreatedId.id}`,
    );

    await this.db.transaction(async (tx) => {
      return await tx
        .insert(userDetails)
        .values({ id: userCreatedId.id, imageId: 1 });
    });

    return this.getUserById(userCreatedId.id);
  }

  async findUserById(id: number): Promise<User[]> {
    return await this.searchService.findOneOrThrow(
      this.db,
      users,
      eq(users.id, id),
      ErrorMessage.USER_NOT_FOUND,
    );
  }

  async updateUser({
    id,
    name,
    email,
    phone,
    address,
    imageId,
  }: UserUpdateDTO): Promise<User> {
    let user: User | undefined;
    try {
      this.logger.debug('User info', id, name, email, phone, address);

      user = await this.getUserById(id);

      this.logger.debug('User getted by id', user);

      const userId: number = user?.id;

      await this.db.transaction(async (tx) => {
        await tx
          .update(users)
          .set({
            name: name,
            email: email,
            updated_at: new Date(),
          })
          .where(eq(users.id, userId));

        await tx
          .update(userDetails)
          .set({
            phone: phone,
            adresss: address,
            imageId: imageId,
          })
          .where(eq(userDetails.id, userId));
      });

      return this.getUserById(userId);
    } catch (error) {
      this.logger.error(`Error: ${error}`);
      throw error;
    } finally {
      this.logger.verbose(`User ${user?.id} updated`);
    }
  }

  async updatePassword(id: number, password: string): Promise<User> {
    try {
      await this.db.transaction(async (tx) => {
        await tx
          .update(users)
          .set({ password: password, updated_at: new Date() })
          .where(eq(users.id, id));
      });

      return this.getUserById(id);
    } catch (error) {
      this.logger.error(`Error: ${error}`);
      throw error;
    } finally {
      this.logger.verbose(`User with ${id} updated`);
    }
  }

  async findUserByIds(ids: number[]): Promise<User[]> {
    return await this.searchService.findManyOrReturnEmptyArray(
      this.db,
      users,
      inArray(users.id, ids),
    );
  }
}
