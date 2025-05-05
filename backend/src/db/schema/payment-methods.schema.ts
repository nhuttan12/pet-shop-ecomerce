import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { status } from './status.schema';
import { timestamps } from '../helper/timestamp';
import { orders } from './orders.schema';
import { relations } from 'drizzle-orm';

export const paymentMethods = mysqlTable('payment_methods', {
  id: int().primaryKey().notNull().autoincrement(),
  name: varchar('name', { length: 45 }),
  statusId: int('status_id')
    .references(() => status.id)
    .notNull(),
  ...timestamps,
});

export const paymentMethodsToOrders = relations(paymentMethods, ({ many }) => ({
  orders: many(orders),
}));
