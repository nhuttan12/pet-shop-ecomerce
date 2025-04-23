import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from '../helper/timestamp';
import { relations } from 'drizzle-orm';
import { products } from './products.schema';

export const brands = mysqlTable('brands', {
  id: int().primaryKey().notNull().autoincrement(),
  name: varchar('name', { length: 45 }).notNull(),
  ...timestamps,
});

export const brandsToProducts = relations(brands, ({ many }) => ({
  products: many(products),
}));
