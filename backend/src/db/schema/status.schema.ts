import { relations } from 'drizzle-orm';
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from '../columns-helper/timestamp';
import { users } from './users.schema';
import { paymentMethods } from './payment-methods.schema';
import { shippingMethods } from './shipping-methods.schema';
import { categories } from './categories.schema';
import { carts } from './carts.schema';
import { petTypes } from './pet-types.schema';
import { products } from './products.schema';
import { orders } from './orders.schema';

export const status = mysqlTable('status', {
  id: int().primaryKey().notNull().autoincrement(),
  name: varchar('name', { length: 45 }).notNull(),
  ...timestamps,
});

export const statusToRole = relations(status, ({ many }) => ({
  roles: many(status),
}));

export const statusToUser = relations(status, ({ many }) => ({
  users: many(users),
}));

export const statusToPaymentMeThod = relations(status, ({ many }) => ({
  paymentMethods: many(paymentMethods),
}));

export const statusToShippingMethod = relations(status, ({ many }) => ({
  shippingMethods: many(shippingMethods),
}));

export const statusToCategory = relations(status, ({ many }) => ({
  categories: many(categories),
}));

export const statusToCart = relations(status, ({ many }) => ({
  carts: many(carts),
}));

export const statusToPetType = relations(status, ({ many }) => ({
  petTypes: many(petTypes),
}));

export const statusToProduct = relations(status, ({ many }) => ({
  products: many(products),
}));

export const statusToOrders = relations(status, ({ many }) => ({
  orders: many(orders),
}));
