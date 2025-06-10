import { relations } from 'drizzle-orm';
import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';
import { ProductStatus } from '@enum/status/product-status.enum';
import { timestamps } from '../helper/timestamp';
import {
  wishlists,
  vouchers,
  productImages,
  orderDetails,
  customerRating,
  categoriesMapping,
  cartDetails,
  brands,
} from '@schema';

export const products = mysqlTable('products', {
  id: int().primaryKey().notNull().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text().notNull(),
  price: int().notNull(),
  brandId: int('brand_id')
    .references(() => brands.id)
    .notNull(),
  status: mysqlEnum(
    Object.values(ProductStatus) as [string, ...string[]],
  ).notNull(),
  stocking: int().notNull(),
  discount: int().notNull(),
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

export const productToVouchers = relations(products, ({ many }) => ({
  vouchers: many(vouchers),
}));

export const productToCustomerRating = relations(products, ({ many }) => ({
  customerRating: many(customerRating),
}));

export const productToProductImage = relations(products, ({ many }) => ({
  productImages: many(productImages),
}));
