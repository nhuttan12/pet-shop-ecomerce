import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';
import { ImageType } from 'src/helper/enum/image-type.enum';
import { timestamps } from '../helper/timestamp';
import { productImages } from './product-images.schema';
import { relations } from 'drizzle-orm';

export const images = mysqlTable('images', {
  id: int().primaryKey().notNull().autoincrement(),

  /**
   * Đường dẫn hình ảnh
   */
  url: text('url').notNull(),

  /**
   * Kiểu ảnh (ví dụ: 'thumbnail', 'banner', 'avatar'...), dùng enum `ImageType`.
   */
  type: mysqlEnum('type', Object.values(ImageType) as [string, ...string[]]),

  /**
   * Tên thư mục lưu trữ trong dịch vụ lưu trữ ảnh (ví dụ: 'home/tmdt-ck').
   */
  folder: varchar('folder', { length: 255 }),
  ...timestamps,
});

export const imagesToProductImage = relations(images, ({ many }) => ({
  productImages: many(productImages),
}));
