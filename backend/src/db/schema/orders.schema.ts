import { int, mysqlEnum, mysqlTable } from 'drizzle-orm/mysql-core';
import { users } from './users.schema';
import { timestamps } from '../helper/timestamp';
import { relations } from 'drizzle-orm';
import { orderDetails } from './order-details.schema';
import { PaymentMethod } from 'src/helper/enum/payment-method.enum';
import { ShippingMethod } from 'src/helper/enum/shipping_method.enum';
import { OrderStatus } from 'src/helper/enum/status/order-status.enum';
import { carts } from './carts.schema';

export const orders = mysqlTable('orders', {
  id: int().primaryKey().notNull().autoincrement(),
  userId: int('user_id')
    .references(() => users.id)
    .notNull(),
  cartId: int('cart_id')
    .references(() => carts.id)
    .notNull(),
  totalPrice: int('total_price').notNull(),
  paymentMethod: mysqlEnum(
    'payment_method',
    Object.values(PaymentMethod) as [string, ...string[]],
  ).notNull(),
  shippingMethod: mysqlEnum(
    'shipping_method',
    Object.values(ShippingMethod) as [string, ...string[]],
  ).notNull(),
  status: mysqlEnum(
    Object.values(OrderStatus) as [string, ...string[]],
  ).notNull(),
  ...timestamps,
});

export const orderToOrderDetails = relations(orders, ({ many }) => ({
  orderDetails: many(orderDetails),
}));
