import { int, mysqlEnum, mysqlTable } from 'drizzle-orm/mysql-core';
import { products, users } from '@schema';
import { timestamps } from '@db-helper/timestamp';
import { RatingStatus } from '@enum/status/customer-rating.enum';

export const customerRatings = mysqlTable('customer-rating', {
  id: int().primaryKey().notNull().autoincrement(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id),
  starRated: int('star_rated').notNull(),
  productId: int('product_id')
    .notNull()
    .references(() => products.id),
  status: mysqlEnum(Object.values(RatingStatus) as [string, ...string[]])
    .notNull()
    .default(RatingStatus.ACTIVE),
  ...timestamps,
});
