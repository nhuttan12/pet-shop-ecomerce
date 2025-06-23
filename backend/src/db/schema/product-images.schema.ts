import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from '@db-helper/timestamp';
import { products, images } from '@schema';

export const productImages = mysqlTable('product_images', {
  id: int().primaryKey().autoincrement().notNull(),
  productId: int('product_id')
    .notNull()
    .references(() => products.id),
  imageId: int('image_id')
    .notNull()
    .references(() => images.id),
  folder: varchar('folder', { length: 255 }),
  ...timestamps,
});
