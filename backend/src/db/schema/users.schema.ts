import { int, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from '../helper/timestamp';
import { roles } from './roles.schema';
import { relations } from 'drizzle-orm';
import { carts } from './carts.schema';
import { wishlists } from './wishlists.schema';
import { UserStatus } from 'src/helper/enum/status/user-status.enum';
import { vouchers } from './vouchers.schema';
import { customerRating } from './customer-rating.schema';
import { voucherMapping } from './voucher-mapping';

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
  customerRating: many(customerRating),
}));

export const usersToVoucherMapping = relations(users, ({ many }) => ({
  voucherMapping: many(voucherMapping),
}));
