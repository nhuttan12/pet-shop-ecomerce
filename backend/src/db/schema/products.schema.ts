import { relations } from 'drizzle-orm';
import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';
import { ProductStatus } from 'src/helper/enum/status/product-status.enum';
import { timestamps } from '../helper/timestamp';
import { brands } from './brands.schema';
import { cartDetails } from './cart-details.schema';
import { categoriesMapping } from './categories-mapping.schema';
import { customerRating } from './customer-rating.schema';
import { orderDetails } from './order-details.schema';
import { vouchers } from './vouchers.schema';
import { wishlists } from './wishlists.schema';
import { productImages } from './product-images.schema';

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

export const productToVouchers = relations(products, ({ many }) => ({
  vouchers: many(vouchers),
}));

export const productToCustomerRating = relations(products, ({ many }) => ({
  customerRating: many(customerRating),
}));

export const productToProductImage = relations(products, ({ many }) => ({
  productImages: many(productImages),
}));
