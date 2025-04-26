import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DrizzleAsyncProvider } from 'src/database/drizzle.provider';
import { User } from 'src/db/helper/schema-type';
import { users } from 'src/db/schema';
import { ErrorMessage } from 'src/helper/error-message';

@Injectable()
export class UserService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private userSelect: MySql2Database<User>,
  ) {}

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

  async getUserByName(username: string): Promise<User> {
    const [user]: User[] = await this.userSelect
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)
      .execute();

    if (!user) {
      throw new UnauthorizedException(ErrorMessage.USER_NOT_FOUND);
    }
    return user;
  }

  async getUserByUsername(username: string): Promise<User> {
    const [user]: User[] = await this.userSelect
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)
      .execute();

    if (!user) {
      throw new UnauthorizedException(ErrorMessage.USER_NOT_FOUND);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const [user] = await this.userSelect
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException(ErrorMessage.USER_NOT_FOUND);
    }
    return user;
  }

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
