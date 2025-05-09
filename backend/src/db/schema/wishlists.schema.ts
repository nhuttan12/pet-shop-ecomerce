import { int, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { users } from './users.schema';
import { products } from './products.schema';

export const wishlists = mysqlTable(
  'wishlists',
  {
    userId: int('user_id')
      .references(() => users.id)
      .notNull(),
    productId: int('product_id')
      .references(() => products.id)
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.productId] })],
);
