import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Role, User, UserDetail, UserInsert } from 'src/db/helper/schema-type';
import { images, roles, userDetails, users } from 'src/db/schema';
import { GetAllUsersResponseDTO } from 'src/helper/dto/response/user/get-all-user-response.dto';
import { CreateUserDto } from 'src/helper/dto/user/create-user.dto';
import { UserUpdateDTO } from 'src/helper/dto/user/update-user.dto';
import { UserStatus } from 'src/helper/enum/status/user-status.enum';
import { ErrorMessage } from 'src/helper/message/error-message';
import { MessageLog } from 'src/helper/message/message-log';
import { DrizzleAsyncProvider } from 'src/modules/database/drizzle.provider';
import { RoleService } from '../role/role.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @Inject(DrizzleAsyncProvider)
    private userSelect: MySql2Database<User>,
    @Inject(DrizzleAsyncProvider)
    private userInsert: MySql2Database<UserInsert>,
    @Inject(DrizzleAsyncProvider)
    private roleSelect: MySql2Database<Role>,
    private roleService: RoleService,
    @Inject(DrizzleAsyncProvider)
    private userDetail: MySql2Database<UserDetail>,
  ) {}

  /**
   * @description: get user information with given
   *  id from database, if not found, throw error
   * @param id: id of user
   * @returns: user
   */
  async getUserById(id: number): Promise<User> {
    this.logger.debug('Id to get user', id);

    const [user] = await this.userSelect
      .select()
      .from(users)
      .where(and(eq(users.id, id), eq(users.status, UserStatus.ACTIVE)));

    if (!user) {
      throw new UnauthorizedException(ErrorMessage.USER_NOT_FOUND);
    }

    this.logger.debug('Uset getted by id', user);

    return user;
  }

  /**
   * @description: get user information with given
   *  name from database, if not found, throw error
   * @param name: name of user
   * @returns: user
   */
  // async getUserByName(name: string): Promise<User> {
  //   this.logger.debug('Name to get user', name);

  //   const [user]: User[] = await this.userSelect
  //     .select()
  //     .from(users)
  //     .where(eq(users.username, name))
  //     .limit(1)
  //     .execute();

  //   if (!user) {
  //     this.logger.error(MessageLog.USER_NOT_FOUND);
  //     throw new UnauthorizedException(ErrorMessage.USER_NOT_FOUND);
  //   }

  //   this.logger.debug('Uset getted by name', user);

  //   return user;
  // }

  /**
   * @description: get user information with given
   *  name from database, if not found, return udefined
   * @param name: name of user
   * @returns: user | undefinded
   */
  async findUserByName(name: string): Promise<User[]> {
    this.logger.debug('Name to get find', name);

    const user: User[] | undefined = await this.userSelect
      .select()
      .from(users)
      .where(eq(users.username, name))
      .limit(1)
      .execute();

    this.logger.debug('User finded by name', user);

    return user;
  }

  /**
   * @description: get user information with given
   *  username from database, if not found, throw error
   * @param username: username of user
   * @returns: user
   */
  async getUserByUsername(username: string): Promise<User> {
    this.logger.debug('Username to get user:', username);

    const [user]: User[] = await this.userSelect
      .select()
      .from(users)
      .where(
        and(eq(users.username, username), eq(users.status, UserStatus.ACTIVE)),
      )
      .limit(1)
      .execute();

    if (!user) {
      this.logger.error(MessageLog.USER_NOT_FOUND);
      throw new UnauthorizedException(ErrorMessage.USER_NOT_FOUND);
    }

    this.logger.debug('User getted by username', user);

    return user;
  }

  /**
   * @description: get user information with given
   *  email from database, if not found, throw error
   * @param email: email of user
   * @returns: user
   */
  async getUserByEmail(email: string): Promise<User> {
    this.logger.debug('Email to get user', email);
    const [user] = await this.userSelect
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.status, UserStatus.ACTIVE)))
      .limit(1);

    if (!user) {
      this.logger.error(MessageLog.USER_NOT_FOUND);
      throw new UnauthorizedException(ErrorMessage.USER_NOT_FOUND);
    }

    this.logger.debug('User getted by email', user);

    return user;
  }

  /**
   * @description: get user information with given
   *  email from database, if not found, return udefined
   * @param email: email of user
   * @returns: user | undefinded
   */
  async findUserByEmail(email: string): Promise<User | undefined> {
    this.logger.debug('Email to find', email);

    const [user] = await this.userSelect
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
    this.logger.debug('Id and username', id, username);

    const [user]: User[] = await this.userSelect
      .select()
      .from(users)
      .where(
        and(
          eq(users.id, id),
          eq(users.username, username),
          eq(users.status, UserStatus.ACTIVE),
        ),
      );

    if (!user) {
      throw new UnauthorizedException(ErrorMessage.USER_NOT_FOUND);
    }

    this.logger.debug('User', user);

    return user;
  }

  async getAllUsers(
    limit: number,
    offset: number,
  ): Promise<GetAllUsersResponseDTO[]> {
    this.logger.debug(`Limit and offset for pagination ${limit}, ${offset}`);
    offset = offset < 0 ? (offset = 0) : offset - 1;

    const user = await this.userSelect
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

  async createUser(createUserDto: CreateUserDto): Promise<number> {
    this.logger.debug('User information to create', createUserDto);

    const [userCreatedId]: { id: number }[] = await this.userInsert.transaction(
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

    this.logger.verbose(
      `Inser deffault image to user detail with id: ${userCreatedId.id}`,
    );

    await this.userInsert.transaction(async (tx) => {
      return await tx
        .insert(userDetails)
        .values({ id: userCreatedId.id, imageId: 1 });
    });

    return userCreatedId.id;
  }

  async findUserById(id: number): Promise<User[]> {
    this.logger.debug('Id to get user', id);

    const user = await this.userSelect
      .select()
      .from(users)
      .where(eq(users.id, id))
      .orderBy(asc(users.id));

    this.logger.debug('Uset getted by id', user);

    return user;
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

      await this.userInsert.transaction(async (tx) => {
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

      const [newUser]: User[] = await this.userSelect
        .select()
        .from(users)
        .where(eq(users.id, id));

      if (!newUser) {
        this.logger.error(MessageLog.USER_NOT_FOUND);
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
      }

      return newUser;
    } catch (error) {
      this.logger.error(`Error: ${error}`);
      throw error;
    } finally {
      this.logger.verbose(`User ${user?.id} updated`);
    }
  }

  async updatePassword(id: number, password: string): Promise<User> {
    try {
      await this.userInsert.transaction(async (tx) => {
        await tx
          .update(users)
          .set({ password: password, updated_at: new Date() })
          .where(eq(users.id, id));
      });

      const [newUser]: User[] = await this.userSelect
        .select()
        .from(users)
        .where(eq(users.id, id));

      if (!newUser) {
        this.logger.error(MessageLog.USER_NOT_FOUND);
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
      }

      return newUser;
    } catch (error) {
      this.logger.error(`Error: ${error}`);
      throw error;
    } finally {
      this.logger.verbose(`User with ${id} updated`);
    }
  }
}
