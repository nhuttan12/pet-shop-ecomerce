import { int, mysqlEnum, mysqlTable } from 'drizzle-orm/mysql-core';
import { users } from './users.schema';
import { timestamps } from '../helper/timestamp';
import { relations } from 'drizzle-orm';
import { orderDetails } from './order-details.schema';
import { PaymentMethod } from 'src/helper/enum/payment-method.enum';
import { ShippingMethod } from 'src/helper/enum/shipping_method.enum';
import { OrderStatus } from 'src/helper/enum/order-status.enum';

export const orders = mysqlTable('orders', {
  id: int().primaryKey().notNull().autoincrement(),
  userId: int('user_id')
    .references(() => users.id)
    .notNull(),
  totalPrice: int('total_price').notNull(),
  paymentMethod: mysqlEnum(
    'payment_method',
    Object.values(PaymentMethod) as [string, ...string[]],
  ),
  shippingMethod: mysqlEnum(
    'shipping_method',
    Object.values(ShippingMethod) as [string, ...string[]],
  ),
  status: mysqlEnum(Object.values(OrderStatus) as [string, ...string[]]),
  ...timestamps,
});

export const orderToOrderDetails = relations(orders, ({ many }) => ({
  orderDetails: many(orderDetails),
}));
