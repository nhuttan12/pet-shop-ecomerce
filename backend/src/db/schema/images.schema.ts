import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';
import { ImageStatus } from 'src/helper/enum/image-status.enum';
import { products } from './products.schema';
import { ImageType } from 'src/helper/enum/image-type.enum';

export const images = mysqlTable('images', {
  id: int().primaryKey().autoincrement().notNull(),
  name: varchar('name', { length: 45 }).notNull(),
  productId: int('product_id')
    .references(() => products.id)
    .notNull(),
  status: mysqlEnum(Object.values(ImageStatus) as [string, ...string[]]),
  imageType: mysqlEnum(
    'image_type',
    Object.values(ImageType) as [string, ...string[]],
  ),
  url: text(),
});
