import { relations } from 'drizzle-orm';
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from '../columns-helper/timestamp';
import { users } from './user.schema';

export const status = mysqlTable('status', {
  id: int().primaryKey().notNull(),
  name: varchar('45').notNull(),
  ...timestamps,
});

export const statusRelation = relations(status, ({ many }) => ({
  roles: many(status),
}));

export const statusToUser = relations(status, ({ many }) => ({
  users: many(users),
}));
