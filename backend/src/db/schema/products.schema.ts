import { images } from './images.schema';
import { int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { brands } from './brands.schema';
import { status } from './status.schema';
import { timestamps } from '../helper/timestamp';
import { relations } from 'drizzle-orm';
import { orderDetails } from './order-details.schema';
import { inventories } from './inventories.schema';
import { categoriesMapping } from './categories-mapping.schema';
import { productsPetMapping } from './product-pet-mapping.schema';
import { favorites } from './favorites.schema';

export const products = mysqlTable('products', {
  id: int().primaryKey().notNull().autoincrement(),
  name: varchar('name', { length: 100 }),
  description: text(),
  price: int(),
  feature: text(),
  brandId: int('brand_id')
    .references(() => brands.id)
    .notNull(),
  statusId: int('status_id')
    .references(() => status.id)
    .notNull(),
  ...timestamps,
});

export const productToOrderDetails = relations(products, ({ many }) => ({
  orderDetails: many(orderDetails),
}));

export const productToInventory = relations(products, ({ many }) => ({
  inventories: many(inventories),
}));

export const productToCategoriesMapping = relations(products, ({ many }) => ({
  categoriesMapping: many(categoriesMapping),
}));

export const productToProductsPetMapping = relations(products, ({ many }) => ({
  productsPetMapping: many(productsPetMapping),
}));

export const productToCartDetails = relations(products, ({ many }) => ({
  cartDetails: many(orderDetails),
}));

export const productToFavorites = relations(products, ({ many }) => ({
  favorites: many(favorites),
}));

export const productToImages = relations(products, ({ many }) => ({
  images: many(images),
}));
