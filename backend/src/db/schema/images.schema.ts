import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';
import { ImageType } from '@enum/image-type.enum';
import { timestamps } from '@db-helper/timestamp';
import { productImages } from '@schema';
import { relations } from 'drizzle-orm';
import { ImageStatus } from '@enum/status/image-status.enum';

export const images = mysqlTable('images', {
  id: int().primaryKey().notNull().autoincrement(),

  /**
   * Đường dẫn hình ảnh
   */
  url: text('url').notNull(),

  /**
   * Kiểu ảnh (ví dụ: 'thumbnail', 'banner', 'avatar'...), dùng enum `ImageType`.
   */
  type: mysqlEnum(
    'type',
    Object.values(ImageType) as [string, ...string[]],
  ).notNull(),

  /**
   * Tên thư mục lưu trữ trong dịch vụ lưu trữ ảnh (ví dụ: 'home/tmdt-ck').
   */
  folder: varchar('folder', { length: 255 }),

  status: mysqlEnum(Object.values(ImageStatus) as [string, ...string[]]),
  ...timestamps,
});

export const imagesToProductImage = relations(images, ({ many }) => ({
  productImages: many(productImages),
}));
