import { int, mysqlEnum, mysqlTable } from 'drizzle-orm/mysql-core';
import { timestamps } from '@db-helper/timestamp';
import { relations } from 'drizzle-orm';
import { PaymentMethod } from '@enum/payment-method.enum';
import { ShippingMethod } from '@enum/shipping_method.enum';
import { OrderStatus } from '@enum/status/order-status.enum';
import { vouchers, users, carts, orderDetails } from '@schema';

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
  voucherId: int('voucher_id')
    .references(() => vouchers.id)
    .unique(),
  status: mysqlEnum(
    Object.values(OrderStatus) as [string, ...string[]],
  ).notNull(),
  ...timestamps,
});

export const orderToOrderDetails = relations(orders, ({ many }) => ({
  orderDetails: many(orderDetails),
}));
