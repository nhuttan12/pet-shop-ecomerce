import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DrizzleAsyncProvider } from 'src/database/drizzle.provider';
import { User } from 'src/db/helper/schema-type';
import { users } from 'src/db/schema';
import { ErrorMessage } from 'src/helper/message/error-message';
import { MessageLog } from 'src/helper/message/message-log';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @Inject(DrizzleAsyncProvider)
    private userSelect: MySql2Database<User>,
  ) {}

  /**
   * @description: get user information with given
   *  id from database, if not found, throw error
   * @param id: id of user
   * @returns: user
   */
  async getUserById(id: number): Promise<User> {
    const [user] = await this.userSelect
      .select()
      .from(users)
      .where(eq(users.id, id));

    if (!user) {
      throw new UnauthorizedException(ErrorMessage.USER_NOT_FOUND);
    }
    return user;
  }

  /**
   * @description: get user information with given
   *  name from database, if not found, throw error
   * @param name: name of user
   * @returns: user
   */
  async getUserByName(name: string): Promise<User> {
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
    return user;
  }

  /**
   * @description: get user information with given
   *  name from database, if not found, return udefined
   * @param name: name of user
   * @returns: user | undefinded
   */
  async findUserByName(name: string): Promise<User | undefined> {
    const [user]: User[] | undefined = await this.userSelect
      .select()
      .from(users)
      .where(eq(users.username, name))
      .limit(1)
      .execute();

    return user;
  }

  /**
   * @description: get user information with given
   *  username from database, if not found, throw error
   * @param username: username of user
   * @returns: user
   */
  async getUserByUsername(username: string): Promise<User> {
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

    return user;
  }

  /**
   * @description: get user information with given
   *  email from database, if not found, throw error
   * @param email: email of user
   * @returns: user
   */
  async getUserByEmail(email: string): Promise<User> {
    const [user] = await this.userSelect
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      this.logger.error(MessageLog.USER_NOT_FOUND);
      throw new UnauthorizedException(ErrorMessage.USER_NOT_FOUND);
    }
    return user;
  }

  /**
   * @description: get user information with given
   *  email from database, if not found, return udefined
   * @param email: email of user
   * @returns: user | undefinded
   */
  async findUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.userSelect
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

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
    const [user]: User[] = await this.userSelect
      .select()
      .from(users)
      .where(and(eq(users.id, id), eq(users.username, username)));

    if (!user) {
      throw new UnauthorizedException(ErrorMessage.USER_NOT_FOUND);
    }
    return user;
  }
}
