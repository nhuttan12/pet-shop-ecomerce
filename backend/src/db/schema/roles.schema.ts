import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { status } from './status.schema';
import { timestamps } from '../helper/timestamp';
import { users } from './users.schema';
import { relations } from 'drizzle-orm';

export const roles = mysqlTable('roles', {
  id: int().primaryKey().notNull().autoincrement(),
  name: varchar('name', { length: 45 }).notNull(),
  statusId: int()
    .references(() => status.id)
    .notNull(),
  ...timestamps,
});

export const roleRelation = relations(roles, ({ many }) => ({
  users: many(users),
}));
