import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Role } from 'src/db/helper/schema-type';
import { roles } from 'src/db/schema';
import { ErrorMessage } from 'src/helper/message/error-message';
import { SearchService } from 'src/modules/helper/services/search.service';
import { DrizzleAsyncProvider } from 'src/modules/helper/database/drizzle.provider';

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
