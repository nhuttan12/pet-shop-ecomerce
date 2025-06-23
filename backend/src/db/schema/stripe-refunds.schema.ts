import { users } from '@schema';
import { int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const stripeRefunds = mysqlTable('stripe_refunds', {
  id: int('id').primaryKey().notNull().autoincrement(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id),
  stripeRefundId: varchar('stripe_refund_id', { length: 255 }).notNull(),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', {
    length: 255,
  }).notNull(),
  amount: int('amount').notNull(), // đơn vị cent
  currency: varchar('currency', { length: 10 }).notNull(), // ví dụ: usd
  status: varchar('status', { length: 50 }).notNull(), // pending | succeeded | failed
  reason: varchar('reason', { length: 255 }), // optional lý do hoàn tiền
  createdAt: timestamp('created_at').notNull(),
});
