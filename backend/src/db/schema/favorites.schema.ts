import { int, mysqlTable } from 'drizzle-orm/mysql-core';
import { users } from './users.schema';
import { products } from './products.schema';

export const favorites = mysqlTable(
  'favorites',
  {
    userId: int('user_id')
      .references(() => users.id)
      .notNull(),
    productId: int('product_id')
      .references(() => products.id)
      .notNull(),
  },
  (t) => ({
    primaryKey: [t.userId, t.productId],
  }),
);
