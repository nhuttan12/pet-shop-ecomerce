import { products } from '@schema';
import { int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const stripePrices = mysqlTable('stripe_prices', {
  id: int('id').primaryKey().notNull().autoincrement(),
  stripeProductId: varchar('stripe_product_id', { length: 255 }).notNull(),
  // .references(() => stripeProducts.stripeProductId),
  stripePriceId: varchar('stripe_price_id', { length: 255 }).notNull(),
  productId: int('product_id')
    .notNull()
    .references(() => products.id),
  amount: int('amount'), // số tiền, đơn vị cent
  currency: varchar('currency', { length: 10 }).notNull(), // vd: 'usd'
  interval: varchar('interval', { length: 50 }), // vd: 'month' | 'year' | 'one_time'
  createdAt: timestamp('created_at').notNull(),
});
