import { int, mysqlEnum, mysqlTable } from 'drizzle-orm/mysql-core';
import { products, users } from '@db-helper';
import { WishlistStatus } from '@wishlist/enums/wishlist-status.enum';
import { timestamps } from 'common/db-helper/timestamp';

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
