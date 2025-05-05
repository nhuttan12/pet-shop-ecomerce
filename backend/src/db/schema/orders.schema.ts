import { int, mysqlTable } from 'drizzle-orm/mysql-core';
import { users } from './users.schema';
import { paymentMethods } from './payment-methods.schema';
import { shippingMethods } from './shipping-methods.schema';
import { status } from './status.schema';
import { timestamps } from '../helper/timestamp';
import { relations } from 'drizzle-orm';
import { orderDetails } from './order-details.schema';

export const orders = mysqlTable('orders', {
  id: int().primaryKey().notNull().autoincrement(),
  userId: int('user_id')
    .references(() => users.id)
    .notNull(),
  totalInvoice: int('total_invoice').notNull(),
  paymentMethod: int('payment_method')
    .references(() => paymentMethods.id)
    .notNull(),
  shippingMethod: int('shipping_method')
    .references(() => shippingMethods.id)
    .notNull(),
  statusId: int('status_id')
    .references(() => status.id)
    .notNull(),
  ...timestamps,
});

export const orderToOrderDetails = relations(orders, ({ many }) => ({
  orderDetails: many(orderDetails),
}));
