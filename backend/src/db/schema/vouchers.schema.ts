import { relations } from 'drizzle-orm';
import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { VoucherStatus } from 'src/helper/enum/status/vouchers-status.enum';
import { timestamps } from '../helper/timestamp';
import { voucherMapping } from './voucher-mapping';

export const vouchers = mysqlTable('vouchers', {
  id: int().primaryKey().notNull().autoincrement(),
  voucherCode: text('voucher_code').notNull(),
  status: mysqlEnum(Object.values(VoucherStatus) as [string, ...string[]]),
  discount: int().notNull(),
  expireAt: timestamp('expire_at').defaultNow().notNull(),
  ...timestamps,
});

export const usersToVoucherMapping = relations(vouchers, ({ many }) => ({
  voucherMapping: many(voucherMapping),
}));
