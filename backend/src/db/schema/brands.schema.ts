import { int, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from '../helper/timestamp';
import { relations } from 'drizzle-orm';
import { BrandStatus } from '@enum/status/brand-status.enum';
import { products } from '@schema';

export const brands = mysqlTable('brands', {
  id: int().primaryKey().notNull().autoincrement(),
  name: varchar('name', { length: 45 }).notNull(),
  status: mysqlEnum(Object.values(BrandStatus) as [string, ...string[]]),
  ...timestamps,
});

export const brandsToProducts = relations(brands, ({ many }) => ({
  products: many(products),
}));
