import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { and, asc, eq, SQL } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { User } from 'src/db/helper/schema-type';
import { images, roles, userDetails, users } from 'src/db/schema';
import { GetAllUsersResponseDTO } from 'src/helper/dto/response/user/get-all-user-response.dto';
import { CreateUserDto } from 'src/helper/dto/user/create-user.dto';
import { UserUpdateDTO } from 'src/helper/dto/user/update-user.dto';
import { UserStatus } from 'src/helper/enum/status/user-status.enum';
import { ErrorMessage } from 'src/helper/message/error-message';
import { MessageLog } from 'src/helper/message/message-log';
import { SearchService } from 'src/helper/services/search.service';
import { DrizzleAsyncProvider } from 'src/modules/database/drizzle.provider';

type UsersTable = typeof users;

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: MySql2Database<any>,
    private searchService: SearchService,
  ) {}

  /**
   * @description: get user information with given
   *  id from database, if not found, throw error
   * @param id: id of user
   * @returns: user
   */
  async getUserById(id: number): Promise<User> {
    return this.searchService.findOneOrThrow<User>(
      this.db,
      users,
      (u: UsersTable): SQL =>
        and(eq(u.id, id), eq(u.status, UserStatus.ACTIVE)) as SQL,
      ErrorMessage.USER_NOT_FOUND,
    );
  }

  /**
   * @description: get user information with given
   *  name from database, if not found, return udefined
   * @param name: name of user
   * @returns: user | undefinded
   */
  async findUserByName(name: string): Promise<User[]> {
    return await this.searchService.findManyOrReturnEmptyArray(
      this.db,
      users,
      (u: UsersTable): SQL =>
        and(eq(u.name, name), eq(u.status, UserStatus.ACTIVE)) as SQL,
      undefined,
      undefined,
      asc(users.id),
    );
  }

  /**
   * @description: get user information with given
   *  username from database, if not found, throw error
   * @param username: username of user
   * @returns: user
   */
  async getUserByUsername(username: string): Promise<User> {
    return await this.searchService.findOneOrThrow(
      this.db,
      users,
      eq(users.username, username),
      ErrorMessage.USER_NOT_FOUND,
    );
  }

  async findUserByUsername(username: string): Promise<User[]> {
    return this.searchService.findManyOrReturnEmptyArray<User, any>(
      this.db,
      users,
      (u: UsersTable) => eq(u.username, username),
    );
  }

  /**
   * @description: get user information with given
   *  email from database, if not found, throw error
   * @param email: email of user
   * @returns: user
   */
  async getUserByEmail(email: string): Promise<User> {
    return await this.searchService.findOneOrThrow(
      this.db,
      users,
      eq(users.email, email),
      ErrorMessage.EMAIL_IS_NOT_FOUND,
    );
  }

  /**
   * @description: get user information with given
   *  email from database, if not found, return udefined
   * @param email: email of user
   * @returns: user | undefinded
   */
  async findUserByEmail(email: string): Promise<User | undefined> {
    this.logger.debug('Email to find', email);

    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    this.logger.debug('User finded', user);

    return user;
  }

  /**
   * @description: get user information with given
   *  username, id from database, if not found, throw error
   * @param id: id of user
   * @param username: username of user
   * @returns: user
   */
  async getUserByIdAndUsername(id: number, username: string): Promise<User> {
    return this.searchService.findOneOrThrow(
      this.db,
      users,
      (u: UsersTable) =>
        and(
          eq(u.id, id),
          eq(u.username, username),
          eq(u.status, UserStatus.ACTIVE),
        ) as SQL,
      ErrorMessage.USER_NOT_FOUND,
    );
  }

  async getAllUsers(
    limit: number,
    offset: number,
  ): Promise<GetAllUsersResponseDTO[]> {
    this.logger.debug(`Limit and offset for pagination ${limit}, ${offset}`);
    offset = offset < 0 ? (offset = 0) : offset - 1;

    const user = await this.db
      .select()
      .from(users)
      .innerJoin(userDetails, eq(users.id, userDetails.id))
      .innerJoin(roles, eq(users.roleId, roles.id))
      .innerJoin(images, eq(userDetails.imageId, images.id))
      .orderBy(asc(users.id))
      .limit(limit)
      .offset(offset);

    this.logger.debug(`User get from db ${JSON.stringify(user)}`);

    const result: GetAllUsersResponseDTO[] = user.map(
      (row): GetAllUsersResponseDTO => ({
        id: row.users.id,
        username: row.users.username,
        password: row.users.password,
        name: row.users.name!,
        email: row.users.email,
        role: row.roles.name,
        status: row.users.status as UserStatus,
        phone: row.user_details.phone!,
        adresss: row.user_details.adresss!,
        image: row.images.url,
      }),
    );

    this.logger.debug(`User list: ${JSON.stringify(result)}`);

    return result;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    this.logger.debug('User information to create', createUserDto);

    const [userCreatedId]: { id: number }[] = await this.db.transaction(
      async (tx) => {
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

    return this.findUserById(userCreatedId.id);
  }

  async findUserById(id: number): Promise<User> {
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

      return this.findUserById(userId);
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

      return this.findUserById(id);
    } catch (error) {
      this.logger.error(`Error: ${error}`);
      throw error;
    } finally {
      this.logger.verbose(`User with ${id} updated`);
    }
  }
}
