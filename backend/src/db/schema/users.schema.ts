import { postReports } from './post-report.schema';
import { int, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from '@db-helper/timestamp';
import { relations } from 'drizzle-orm';
import {
  carts,
  roles,
  wishlists,
  vouchers,
  productRatings,
  voucherMapping,
  postEditRequests,
} from '@schema';
import { UserStatus } from '@enum/status/user-status.enum';

export const users = mysqlTable('users', {
  id: int().notNull().primaryKey().autoincrement(),
  username: varchar('username', { length: 45 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 100 }).notNull().unique(),
  roleId: int('role_id')
    .references(() => roles.id)
    .notNull(),
  status: mysqlEnum(Object.values(UserStatus) as [string, ...string[]]),
  ...timestamps,
});

export const usersToCarts = relations(users, ({ many }) => ({
  carts: many(carts),
}));

export const usersToWishlist = relations(users, ({ many }) => ({
  wishlists: many(wishlists),
}));

export const usersToVouchers = relations(users, ({ many }) => ({
  vouchers: many(vouchers),
}));

export const usersToCustomerRating = relations(users, ({ many }) => ({
  customerRating: many(productRatings),
}));

export const usersToVoucherMapping = relations(users, ({ many }) => ({
  voucherMapping: many(voucherMapping),
}));

export const usersToEditPostRequest = relations(users, ({ many }) => ({
  postEditRequest: many(postEditRequests),
}));

export const usersToPostReports = relations(users, ({ many }) => ({
  postReports: many(postReports),
}));
