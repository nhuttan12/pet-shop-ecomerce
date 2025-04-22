import { datetime, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { status } from './status.schema';
import { timestamps } from '../columns-helper/timestamp';
import { relations } from 'drizzle-orm';
import { orders } from './orders.schema';

export const shippingMethods = mysqlTable('shipping_methods', {
  id: int().primaryKey().notNull().autoincrement(),
  name: varchar('name', { length: 45 }),
  estimateTime: datetime('estimate_time'),
  statusId: int('status_id')
    .references(() => status.id)
    .notNull(),
  ...timestamps,
});

export const shippingMethodsToOrders = relations(
  shippingMethods,
  ({ many }) => ({
    orders: many(orders),
  }),
);
