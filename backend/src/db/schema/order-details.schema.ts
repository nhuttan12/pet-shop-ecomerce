import { int, mysqlTable } from 'drizzle-orm/mysql-core';
import { orders, products } from '@schema';

export const orderDetails = mysqlTable('order_details', {
  id: int('id').primaryKey().autoincrement().notNull(),

  orderId: int('order_id')
    .references(() => orders.id)
    .notNull(),

  productId: int('product_id')
    .references(() => products.id)
    .notNull(),

  quantity: int().notNull(),
  price: int().notNull(),
  totalPrice: int('total_price').notNull(),
});
