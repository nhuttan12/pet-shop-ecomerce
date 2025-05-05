import { int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { products } from './products.schema';
import { status } from './status.schema';
import { imageTypes } from './image-types.schema';

export const images = mysqlTable('images', {
  id: int().primaryKey().autoincrement().notNull(),
  name: varchar('name', { length: 45 }).notNull(),
  productId: int('product_id')
    .references(() => products.id)
    .notNull(),
  url: text(),
  statusId: int('status_id')
    .references(() => status.id)
    .notNull(),
  imageType: int('image_type_id')
    .references(() => imageTypes.id)
    .notNull(),
});
