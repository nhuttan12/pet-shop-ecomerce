import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DrizzleAsyncProvider } from 'src/modules/database/drizzle.provider';
import { User, UserInsert } from 'src/db/helper/schema-type';
import { userDetail, users } from 'src/db/schema';
import { ErrorMessage } from 'src/helper/message/error-message';
import { MessageLog } from 'src/helper/message/message-log';
import { CreateUserDto } from 'src/helper/dto/user/create-user.dto';
import { UserUpdateDTO } from 'src/helper/dto/user/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @Inject(DrizzleAsyncProvider)
    private userSelect: MySql2Database<User>,
    @Inject(DrizzleAsyncProvider)
    private userInsert: MySql2Database<UserInsert>,
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
      .where(eq(users.id, id));

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
  async getUserByName(name: string): Promise<User> {
    this.logger.debug('Name to get user', name);

    const [user]: User[] = await this.userSelect
      .select()
      .from(users)
      .where(eq(users.username, name))
      .limit(1)
      .execute();

    if (!user) {
      this.logger.error(MessageLog.USER_NOT_FOUND);
      throw new UnauthorizedException(ErrorMessage.USER_NOT_FOUND);
    }

    this.logger.debug('Uset getted by name', user);

    return user;
  }

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
      .where(eq(users.username, username))
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
      .where(eq(users.email, email))
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
      .where(and(eq(users.id, id), eq(users.username, username)));

    if (!user) {
      throw new UnauthorizedException(ErrorMessage.USER_NOT_FOUND);
    }

    this.logger.debug('User', user);

    return user;
  }

  async getAllUsers(limit: number, offset: number): Promise<User[]> {
    this.logger.debug('Limit and offset for pagination', limit, offset);

    const user: User[] = await this.userSelect
      .select()
      .from(users)
      .orderBy(asc(users.id))
      .limit(limit)
      .offset(offset);

    this.logger.debug('User list', user);

    return user;
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
  }: UserUpdateDTO): Promise<void> {
    let user: User | undefined;
    try {
      this.logger.debug('User info', id, name, email, phone, address);

      user = await this.getUserById(id);

      this.logger.debug('User getted by id', user);

      const userId: number = user.id;

      await this.userInsert.transaction(async (tx) => {
        await tx
          .update(users)
          .set({
            name: name,
            email: email,
          })
          .where(eq(users.id, userId));

        await tx
          .update(userDetail)
          .set({
            phone: phone,
            adresss: address,
          })
          .where(eq(userDetail.id, userId));
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.logger.verbose(`User ${user?.id} updated`);
    }
  }
}
