import { timestamps } from '@db-helper/timestamp';
import { orders, users } from '@schema';
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const stripePaymentIntents = mysqlTable('stripe_payment_intents', {
  id: int().primaryKey().notNull().autoincrement(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id),
  orderId: int('order_id')
    .notNull()
    .references(() => orders.id),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  amount: int().notNull(),
  currency: varchar('currency', { length: 255 }).notNull(),
  status: varchar('status', { length: 255 }).notNull(),
  ...timestamps,
});
