import { timestamps } from '@db-helper/timestamp';
import { users } from '@schema';
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const stripePaymentMethods = mysqlTable('stripe_payment_methods', {
  id: int().primaryKey().notNull().autoincrement(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id),
  stripePaymentMethodId: int('stripe_payment_method_id').notNull(),
  type: varchar('type', { length: 255 }).notNull(),
  last4: varchar('last4', { length: 255 }).notNull(),
  exp_month: int('exp_month').notNull(),
  exp_year: int('exp_year').notNull(),
  created_at: timestamps.created_at,
});
