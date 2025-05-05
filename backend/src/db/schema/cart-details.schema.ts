import { int, mysqlTable } from 'drizzle-orm/mysql-core';
import { products } from './products.schema';
import { carts } from './carts.schema';

export const cartDetails = mysqlTable('cart_details', {
  id: int().primaryKey().notNull().autoincrement(),
  cartId: int('cart_id')
    .references(() => carts.id)
    .notNull(),
  productId: int('product_id')
    .references(() => products.id)
    .notNull(),
  quantity: int('quantity').notNull(),
  price: int('price').notNull(),
});
