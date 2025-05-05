import { int, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { orders } from './orders.schema';
import { products } from './products.schema';

export const orderDetails = mysqlTable(
  'order_details',
  {
    orderId: int('order_id')
      .references(() => orders.id)
      .notNull(),
    productId: int('product_id')
      .references(() => products.id)
      .notNull(),
    quantity: int(),
    price: int(),
    totalPrice: int('total_price'),
  },
  (t) => [primaryKey({ columns: [t.orderId, t.productId] })],
);
