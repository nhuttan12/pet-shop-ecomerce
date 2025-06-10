import { int, mysqlTable } from 'drizzle-orm/mysql-core';
import { users, vouchers } from '@schema';
import { timestamps } from '../helper/timestamp';

export const voucherMapping = mysqlTable('voucher_mapping', {
  id: int('id').primaryKey().autoincrement().notNull(),
  userId: int('user_id')
    .references(() => users.id)
    .notNull(),
  voucherId: int('voucher_id')
    .references(() => vouchers.id)
    .notNull(),
  ...timestamps,
});
