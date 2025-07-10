import { timestamp } from 'drizzle-orm/mysql-core';

export const timestamps = {
  updated_at: timestamp().defaultNow().notNull(),
  created_at: timestamp().defaultNow().notNull(),
};
