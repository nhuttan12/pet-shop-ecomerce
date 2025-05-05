import { int, mysqlTable } from 'drizzle-orm/mysql-core';
import { products } from './products.schema';

export const inventories = mysqlTable('inventories', {
  productId: int('product_id')
    .references(() => products.id)
    .notNull()
    .primaryKey(),
  stocking: int().notNull(),
});
