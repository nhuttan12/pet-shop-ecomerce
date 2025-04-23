import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { status } from './status.schema';
import { timestamps } from '../helper/timestamp';
import { relations } from 'drizzle-orm';
import { categoriesMapping } from './categories-mapping.schema';

export const categories = mysqlTable('categories', {
  id: int().primaryKey().notNull().autoincrement(),
  name: varchar('name', { length: 45 }),
  description: varchar('description', { length: 255 }),
  statusId: int('status_id')
    .references(() => status.id)
    .notNull(),
  ...timestamps,
});

export const categoriesToCategoryMapping = relations(
  categories,
  ({ many }) => ({
    categoriesMapping: many(categoriesMapping),
  }),
);
