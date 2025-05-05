import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DrizzleAsyncProvider } from 'src/database/drizzle.provider';
import { User } from 'src/db/helper/schema-type';

@Injectable()
export class ProductService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private userSelect: MySql2Database<User>,
  ) {}
}
