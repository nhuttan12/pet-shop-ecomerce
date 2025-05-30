import { int, mysqlTable } from 'drizzle-orm/mysql-core';
import { orders } from './orders.schema';
import { products } from './products.schema';

export const orderDetails = mysqlTable('order_details', {
  id: int('id').primaryKey().autoincrement().notNull(),

  orderId: int('order_id')
    .references(() => orders.id)
    .notNull(),

  productId: int('product_id')
    .references(() => products.id)
    .notNull(),

  quantity: int(),
  price: int(),
  totalPrice: int('total_price'),
});
