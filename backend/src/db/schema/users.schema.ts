import { status } from './status.schema';
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from '../columns-helper/timestamp';
import { roles } from './roles.schema';
import { relations } from 'drizzle-orm';
import { carts } from './carts.schema';
import { favorites } from './favorites.schema';

export const users = mysqlTable('users', {
  id: int().notNull().primaryKey().autoincrement(),
  username: varchar('username', { length: 45 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 100 }).notNull().unique(),
  phone: varchar('phone', { length: 10 }).notNull().unique(),
  adresss: varchar('adresss', { length: 255 }),
  roleId: int('role_id')
    .references(() => roles.id)
    .notNull(),
  statusId: int('status_id')
    .references(() => status.id)
    .notNull(),
  ...timestamps,
});

export const usersToCarts = relations(users, ({ many }) => ({
  carts: many(carts),
}));

export const usersToFavorites = relations(users, ({ many }) => ({
  favorites: many(favorites),
}));
