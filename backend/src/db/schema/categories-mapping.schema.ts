import { int, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { categories } from './categories.schema';
import { products } from './products.schema';
export const categoriesMapping = mysqlTable(
  'categories_mapping',
  {
    productId: int('product_id')
      .references(() => products.id)
      .notNull(),
    categoryId: int('category_id')
      .references(() => categories.id)
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.productId, t.productId] })],
);
