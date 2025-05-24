import { relations } from 'drizzle-orm';
import { int, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { CategoryStatus } from 'src/helper/enum/status/categories-status.enum';
import { timestamps } from '../helper/timestamp';
import { categoriesMapping } from './categories-mapping.schema';
import { images } from './images.schema';

export const categories = mysqlTable('categories', {
  id: int().primaryKey().notNull().autoincrement(),
  name: varchar('name', { length: 45 }),
  status: mysqlEnum(Object.values(CategoryStatus) as [string, ...string[]]),
  imageId: int('image_id')
    .notNull()
    .references(() => images.id),
  ...timestamps,
});

export const categoriesToCategoryMapping = relations(
  categories,
  ({ many }) => ({
    categoriesMapping: many(categoriesMapping),
  }),
);
