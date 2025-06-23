import { relations } from 'drizzle-orm';
import { int, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { CategoryStatus } from '@enum/status/categories-status.enum';
import { timestamps } from '@db-helper/timestamp';
import { images, categoriesMapping } from '@schema';

export const categories = mysqlTable('categories', {
  id: int().primaryKey().notNull().autoincrement(),
  name: varchar('name', { length: 45 }).notNull(),
  status: mysqlEnum(
    Object.values(CategoryStatus) as [string, ...string[]],
  ).notNull(),
  imageId: int('image_id').references(() => images.id),
  ...timestamps,
});

export const categoriesToCategoryMapping = relations(
  categories,
  ({ many }) => ({
    categoriesMapping: many(categoriesMapping),
  }),
);
