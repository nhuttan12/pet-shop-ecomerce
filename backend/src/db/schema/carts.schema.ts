import { int, mysqlEnum, mysqlTable } from 'drizzle-orm/mysql-core';
import { timestamps } from '../helper/timestamp';
import { relations } from 'drizzle-orm';
import { cartDetails, users } from '@schema';
import { CartStatus } from '@enum/status/cart-status.enum';

export const carts = mysqlTable('carts', {
  id: int().primaryKey().notNull().autoincrement(),
  userId: int('user_id')
    .references(() => users.id)
    .notNull(),
  status: mysqlEnum(
    Object.values(CartStatus) as [string, ...string[]],
  ).notNull(),
  ...timestamps,
});

export const cartsToCartDetails = relations(carts, ({ many }) => ({
  cartDetails: many(cartDetails),
}));
