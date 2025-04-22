import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from '../columns-helper/timestamp';

export const brands = mysqlTable('brands', {
  id: int().primaryKey().notNull().autoincrement(),
  name: varchar('name', { length: 45 }).notNull(),
  ...timestamps,
});
