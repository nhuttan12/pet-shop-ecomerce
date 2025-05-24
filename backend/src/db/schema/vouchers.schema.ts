import { int, mysqlEnum, mysqlTable, text } from 'drizzle-orm/mysql-core';
import { VoucherStatus } from 'src/helper/enum/status/vouchers-status.enum';
import { users } from './users.schema';
import { products } from './products.schema';

export const vouchers = mysqlTable('vouchers', {
  id: int().primaryKey().notNull().autoincrement(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id),
  productId: int('product_id')
    .notNull()
    .references(() => products.id),
  voucherCode: text('voucher_code').notNull(),
  status: mysqlEnum(Object.values(VoucherStatus) as [string, ...string[]]),
  discount: int().notNull(),
});
