import { int, mysqlTable } from 'drizzle-orm/mysql-core';
import { products } from './products.schema';
import { users } from './users.schema';

export const wishlists = mysqlTable('wishlists', {
  id: int().notNull().primaryKey().autoincrement(),
  userId: int('user_id')
    .references(() => users.id)
    .notNull(),
  productId: int('product_id')
    .references(() => products.id)
    .notNull(),
});
