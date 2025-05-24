import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { ContactStatus } from 'src/helper/enum/status/contact-status.enum copy';

export const contacts = mysqlTable('contacts', {
  id: int().primaryKey().notNull().autoincrement(),
  name: varchar('name', { length: 50 }),
  email: varchar('email', { length: 100 }),
  title: varchar('title', { length: 255 }),
  message: text(),
  status: mysqlEnum(Object.values(ContactStatus) as [string, ...string[]]),
  created_at: timestamp().defaultNow().notNull(),
});
