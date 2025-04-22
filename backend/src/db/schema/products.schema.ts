import { int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { brands } from './brands.schema';
import { status } from './status.schema';
import { timestamps } from '../columns-helper/timestamp';

export const products = mysqlTable('products', {
  id: int().primaryKey().notNull().autoincrement(),
  name: varchar('name', { length: 100 }),
  description: text(),
  price: int(),
  feature: text(),
  brandId: int('brand_id')
    .references(() => brands.id)
    .notNull(),
  statusId: int('status_id')
    .references(() => status.id)
    .notNull(),
  ...timestamps,
});
