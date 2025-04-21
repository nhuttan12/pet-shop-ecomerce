import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { status } from './status.schema';
import { timestamps } from '../columns-helper/timestamp';
import { users } from './user.schema';
import { relations } from 'drizzle-orm';

export const roles = mysqlTable('roles', {
  id: int().primaryKey().notNull(),
  name: varchar('45').notNull(),
  statusId: int()
    .references(() => status.id)
    .notNull(),
  ...timestamps,
});

export const roleRelation = relations(roles, ({ many }) => ({
  users: many(users),
}));
