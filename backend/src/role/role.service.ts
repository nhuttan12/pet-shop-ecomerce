import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DrizzleAsyncProvider } from 'src/database/drizzle.provider';
import { Role } from 'src/db/helper/schema-type';
import { roles } from 'src/db/schema';
import { ErrorMessage } from 'src/helper/message/error-message';

@Injectable()
export class RoleService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private roleSelect: MySql2Database<Role>,
  ) {}

  /**
   * @description: get role information with the
   *  id from database, if not found, throw error
   * @param id: id of role to found
   * @returns: role
   */
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

  /**
   * @description: get role by name from the database,
   *  if found return the role, if not found, throw error with code 401
   * @param name: name of the role for founding
   * @returns: role
   */
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
