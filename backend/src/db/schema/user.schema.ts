import { status } from './status.schema';
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from '../columns-helper/timestamp';
import { roles } from './role.schema';

export const users = mysqlTable('users', {
  id: int().notNull().primaryKey(),
  username: varchar('45').notNull().unique(),
  password: varchar('255').notNull(),
  name: varchar('100'),
  email: varchar('100').notNull().unique(),
  phone: varchar('10').notNull().unique(),
  adresss: varchar('255'),
  roleId: int('role_id')
    .references(() => roles.id)
    .notNull(),
  statusId: int('status_id')
    .references(() => status.id)
    .notNull(),
  ...timestamps,
});
