import { int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from '../helper/timestamp';
import { images } from './images.schema';
import { products } from './products.schema';

/**
 * Bảng `product-images` lưu thông tin các hình ảnh liên kết với sản phẩm.
 * Cho phép một sản phẩm có nhiều ảnh và mỗi ảnh có thể kèm theo metadata như URL, folder.
 */
export const productImages = mysqlTable('product-images', {
  /**
   * ID tự tăng, khóa chính.
   */
  id: int().primaryKey().autoincrement().notNull(),

  /**
   * Khóa ngoại tham chiếu tới bảng `products.id`, đại diện cho sản phẩm mà ảnh liên kết tới.
   */
  productId: int('product_id')
    .notNull()
    .references(() => products.id),

  /**
   * Khóa ngoại tham chiếu tới bảng `images.id`, đại diện cho ảnh đang được liên kết.
   */
  imageId: int('image_id')
    .notNull()
    .references(() => images.id),

  /**
   * Đường dẫn URL công khai tới ảnh (thường là từ Cloudinary hoặc S3).
   */
  url: text('url').notNull(),

  /**
   * Tên thư mục lưu trữ trong dịch vụ lưu trữ ảnh (ví dụ: 'home/tmdt-ck').
   */
  folder: varchar('folder', { length: 255 }),

  ...timestamps,
});
