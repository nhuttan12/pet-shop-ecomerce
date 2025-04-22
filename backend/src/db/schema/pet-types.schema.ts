import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { status } from './status.schema';
import { timestamps } from '../columns-helper/timestamp';

export const petTypes = mysqlTable('pet_types', {
  id: int().primaryKey().notNull().autoincrement(),
  name: varchar('name', { length: 45 }),
  statusId: int('status_id')
    .references(() => status.id)
    .notNull(),
  ...timestamps,
});
