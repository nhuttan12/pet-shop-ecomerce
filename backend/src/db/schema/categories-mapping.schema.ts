import { int, mysqlTable } from 'drizzle-orm/mysql-core';
import { categories } from './categories.schema';
import { products } from './products.schema';

export const categoriesMapping = mysqlTable('categories_mapping', {
  id: int('id').primaryKey().autoincrement().notNull(),
  productId: int('product_id')
    .references(() => products.id)
    .notNull(),
  categoryId: int('category_id')
    .references(() => categories.id)
    .notNull(),
});
