import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DrizzleAsyncProvider } from 'src/database/drizzle.provider';
import { User } from 'src/db/helper/schema-type';
import { users } from 'src/db/schema';

@Injectable()
export class UserService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: MySql2Database<User>,
    @Inject(DrizzleAsyncProvider)
    private userSelect: MySql2Database<User>,
  ) {}

  async getUserById(id: number): Promise<User> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));

    return user;
  }

  async getUserByName(username: string): Promise<User> {
    const [user]: User[] = await this.userSelect
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)
      .execute();

    return user;
  }

  async getUserByUsername(username: string): Promise<User> {
    const [user]: User[] = await this.userSelect
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)
      .execute();

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user;
  }
}
