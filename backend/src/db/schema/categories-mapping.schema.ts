import { int, mysqlTable } from 'drizzle-orm/mysql-core';
import { categories, products } from '@schema';
import { timestamps } from '@db-helper/timestamp';

export const categoriesMapping = mysqlTable('categories_mapping', {
  id: int('id').primaryKey().autoincrement().notNull(),
  productId: int('product_id')
    .references(() => products.id)
    .notNull(),
  categoryId: int('category_id')
    .references(() => categories.id)
    .notNull(),
  ...timestamps,
});
