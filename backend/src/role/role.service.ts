import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DrizzleAsyncProvider } from 'src/database/drizzle.provider';
import { Role } from 'src/db/helper/schema-type';
import { roles } from 'src/db/schema';
import { ErrorMessage } from 'src/helper/error-message';

@Injectable()
export class RoleService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private roleSelect: MySql2Database<Role>,
  ) {}

  async getRoleById(id: number): Promise<Role> {
    const [role]: Role[] = await this.roleSelect
      .select()
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1)
      .execute();

    if (!role) {
      throw new UnauthorizedException(ErrorMessage.ROLE_NOT_FOUND);
    }

    return role;
  }
  async getRoleByName(name: string): Promise<Role> {
    const [role]: Role[] = await this.roleSelect
      .select()
      .from(roles)
      .where(eq(roles.name, name))
      .limit(1)
      .execute();

    if (!role) {
      throw new UnauthorizedException(ErrorMessage.ROLE_NOT_FOUND);
    }

    return role;
  }
}
