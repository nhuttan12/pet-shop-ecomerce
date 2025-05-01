import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DrizzleAsyncProvider } from 'src/database/drizzle.provider';
import { Status } from 'src/db/helper/schema-type';
import { status } from 'src/db/schema';
import { ErrorMessage } from 'src/helper/message/error-message';

@Injectable()
export class StatusService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private statusSelect: MySql2Database<Status>,
  ) {}

  /**
   * @description: get status by name from the database,
   *  if found return the status, if not found, throw error with code 401
   * @param name: name of the status for founding
   * @returns: status
   */
  async getStatusByName(name: string): Promise<Status> {
    const [statusRecord]: Status[] = await this.statusSelect
      .select()
      .from(status)
      .where(eq(status.name, name))
      .limit(1)
      .execute();

    if (!statusRecord) {
      throw new UnauthorizedException(ErrorMessage.STATUS_NOT_FOUND);
    }
    return statusRecord;
  }

  /**
   * @description: get status information with given
   *  id from database, if not found, throw error
   * @param id: id of status to found
   * @returns: status
   */
  async getStatusById(id: number): Promise<Status> {
    const [statusRecord]: Status[] = await this.statusSelect
      .select()
      .from(status)
      .where(eq(status.id, id))
      .limit(1)
      .execute();

    if (!statusRecord) {
      throw new UnauthorizedException(ErrorMessage.STATUS_NOT_FOUND);
    }

    return statusRecord;
  }
}
