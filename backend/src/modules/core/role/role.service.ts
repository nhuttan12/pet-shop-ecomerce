import { DrizzleAsyncProvider } from '@helper-modules/database/drizzle.provider';
import { SearchService } from '@helper-modules/services/search.service';
import { ErrorMessage } from '@message/error-message';
import { Inject, Injectable } from '@nestjs/common';
import { roles } from '@schema';
import { Role } from '@schema-type';
import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

@Injectable()
export class RoleService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: MySql2Database<any>,
    private searchService: SearchService,
  ) {}

  /**
   * @description: get role information with the
   *  id from database, if not found, throw error
   * @param id: id of role to found
   * @returns: role
   */
  async getRoleById(id: number): Promise<Role> {
    return this.searchService.findOneOrThrow(
      this.db,
      roles,
      eq(roles.id, id),
      ErrorMessage.ROLE_NOT_FOUND,
    );
  }

  /**
   * @description: get role by name from the database,
   *  if found return the role, if not found, throw error with code 401
   * @param name: name of the role for founding
   * @returns: role
   */
  async getRoleByName(name: string): Promise<Role> {
    return this.searchService.findOneOrThrow(
      this.db,
      roles,
      eq(roles.name, name),
      ErrorMessage.ROLE_NOT_FOUND,
    );
  }
}
