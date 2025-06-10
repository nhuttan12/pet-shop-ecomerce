import { int, mysqlTable } from 'drizzle-orm/mysql-core';
import { products, users } from '@schema';

export const customerRating = mysqlTable('customer-rating', {
  id: int().primaryKey().notNull().autoincrement(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id),
  starRated: int('star_rated'),
  productId: int('product_id')
    .notNull()
    .references(() => products.id),
});
