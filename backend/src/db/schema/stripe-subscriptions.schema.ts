import { users } from '@schema';
import { int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const stripeSubscriptions = mysqlTable('stripe_subscriptions', {
  id: int().primaryKey().notNull().autoincrement(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id),
  stripeSubscriptionId: varchar('stripe_subscription_id', {
    length: 255,
  }).notNull(),
  stripePriceId: varchar('stripe_price_id', { length: 255 }).notNull(),
  status: varchar('status', { length: 255 }).notNull(),
  startDate: timestamp('start_date').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  cancelAt: timestamp('cancel_at'),
  canceledAt: timestamp('canceled_at'),
});
