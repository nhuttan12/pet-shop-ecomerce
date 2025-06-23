import { timestamps } from '@db-helper/timestamp';
import { users } from '@schema';
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const stripeCustomers = mysqlTable('stripe_customers', {
  id: int().primaryKey().notNull().autoincrement(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id),
  stripeCustomersId: varchar('stripe_customers_id', { length: 255 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  created_at: timestamps.created_at,
});
