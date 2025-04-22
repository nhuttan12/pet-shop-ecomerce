import {
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const contacts = mysqlTable('contacts', {
  id: int().primaryKey().notNull().autoincrement(),
  name: varchar('name', { length: 50 }),
  email: varchar('email', { length: 100 }),
  title: varchar('title', { length: 255 }),
  message: text(),
  created_at: timestamp().defaultNow().notNull(),
});
