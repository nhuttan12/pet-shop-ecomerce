import { int, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from '../helper/timestamp';
import { relations } from 'drizzle-orm';
import { products } from './products.schema';
import { BrandStatus } from 'src/helper/enum/status/brand-status.enum';

export const brands = mysqlTable('brands', {
  id: int().primaryKey().notNull().autoincrement(),
  name: varchar('name', { length: 45 }).notNull(),
  status: mysqlEnum(Object.values(BrandStatus) as [string, ...string[]]),
  ...timestamps,
});

export const brandsToProducts = relations(brands, ({ many }) => ({
  products: many(products),
}));
