import { images } from './images.schema';
import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';
import { brands } from './brands.schema';
import { timestamps } from '../helper/timestamp';
import { relations } from 'drizzle-orm';
import { orderDetails } from './order-details.schema';
import { categoriesMapping } from './categories-mapping.schema';
import { wishlists } from './wishlists.schema';
import { ProductStatus } from 'src/helper/enum/product-status.enum';
import { vouchers } from './vouchers.schema';
import { customerRating } from './customer-rating.schema';
import { cartDetails } from './cart-details.schema';

export const products = mysqlTable('products', {
  id: int().primaryKey().notNull().autoincrement(),
  name: varchar('name', { length: 100 }),
  description: text(),
  price: int(),
  brandId: int('brand_id')
    .references(() => brands.id)
    .notNull(),
  feature: text(),
  status: mysqlEnum(Object.values(ProductStatus) as [string, ...string[]]),
  stocking: int(),
  dícount: int(),
  total_price: int(),
  ...timestamps,
});

export const productToOrderDetails = relations(products, ({ many }) => ({
  orderDetails: many(orderDetails),
}));

export const productToCategoriesMapping = relations(products, ({ many }) => ({
  categoriesMapping: many(categoriesMapping),
}));

export const productToCartDetails = relations(products, ({ many }) => ({
  cartDetails: many(cartDetails),
}));

export const productToFavorites = relations(products, ({ many }) => ({
  favorites: many(wishlists),
}));

export const productToImages = relations(products, ({ many }) => ({
  images: many(images),
}));

export const productToVouchers = relations(products, ({ many }) => ({
  vouchers: many(vouchers),
}));

export const productToCustomerRating = relations(products, ({ many }) => ({
  customerRating: many(customerRating),
}));
