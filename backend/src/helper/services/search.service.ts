import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SQL } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  async findOneOrThrow<T>(
    db: MySql2Database<any>,
    table: any,
    where: SQL<unknown> | ((aliases: any) => SQL<unknown>),
    errorMessage?: string,
  ): Promise<T> {
    const [item] = await db
      .select()
      .from(table)
      .where(where)
      .limit(1)
      .execute();
    this.logger.log(`Found one item in table ${table}}`);

    if (!item) {
      throw new UnauthorizedException(errorMessage);
    }

    return item;
  }

  async findManyOrReturnEmptyArray<T, Schema extends Record<string, unknown>>(
    db: MySql2Database<Schema>,
    table: any,
    where?: SQL<unknown> | ((aliases: any) => SQL<unknown>),
    limit?: number,
    offset?: number,
    orderBy?: SQL<unknown>,
  ): Promise<T[]> {
    const baseQuery = db.select().from(table);

    const whereQuery = where ? baseQuery.where(where) : baseQuery;

    const limitQuery =
      typeof limit === 'number' ? whereQuery.limit(limit) : whereQuery;

    const offsetQuery =
      typeof offset === 'number' ? limitQuery.offset(offset) : limitQuery;

    const orderByQuery =
      typeof orderBy === 'string' ? offsetQuery.orderBy(orderBy) : offsetQuery;

    const items = await orderByQuery.execute();

    return items ?? [];
  }
}
