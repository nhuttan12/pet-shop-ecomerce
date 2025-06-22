import { MessageLog } from '@message/message-log';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SQL } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

@Injectable()
export class UpdateService {
  private readonly logger = new Logger(UpdateService.name);
  async updateOrThrowError<T>(
    db: MySql2Database<any>,
    table: any,
    update: Partial<T>,
    where: SQL<unknown>,
    errorMessage: string,
    limit: number = 1,
  ): Promise<any> {
    const query = await db.transaction((tx) => {
      return tx.update(table).set(update).where(where).limit(limit).execute();
    });

    if (!query) {
      this.logger.error(MessageLog.ERROR_IN_UPDATE);
      throw new InternalServerErrorException(errorMessage);
    }

    return query;
  }
}
