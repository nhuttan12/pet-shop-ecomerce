import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { users } from './users.schema';

export const userDetail = mysqlTable('user_details', {
  id: int()
    .notNull()
    .primaryKey()
    .references(() => users.id),
  phone: varchar('phone', { length: 10 }).unique(),
  adresss: varchar('adresss', { length: 255 }),
});
