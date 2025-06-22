import { products } from '@schema';
import {
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const stripeProducts = mysqlTable('stripe_products', {
  id: int('id').primaryKey().notNull().autoincrement(),
  productId: int('product_id')
    .notNull()
    .references(() => products.id),
  stripeProductId: varchar('stripe_product_id', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull(),
});
