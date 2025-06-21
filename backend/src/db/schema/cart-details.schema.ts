import { int, mysqlEnum, mysqlTable } from 'drizzle-orm/mysql-core';
import { CartDetailStatus } from '@enum/status/cart-detail-status.enum';
import { carts, products } from '@schema';

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
  status: mysqlEnum(
    Object.values(CartDetailStatus) as [string, ...string[]],
  ).notNull(),
});
