import { int, mysqlEnum, mysqlTable } from 'drizzle-orm/mysql-core';
import { products } from './products.schema';
import { users } from './users.schema';
import { timestamps } from '../helper/timestamp';
import { WishlistStatus } from 'src/helper/enum/status/wishlist-status.enum';

export const wishlists = mysqlTable('wishlists', {
  id: int().notNull().primaryKey().autoincrement(),
  userId: int('user_id')
    .references(() => users.id)
    .notNull(),
  productId: int('product_id')
    .references(() => products.id)
    .notNull(),
  status: mysqlEnum(Object.values(WishlistStatus) as [string, ...string[]]),
  ...timestamps,
});
