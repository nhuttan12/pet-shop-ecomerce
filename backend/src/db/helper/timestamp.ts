import { timestamp } from 'drizzle-orm/mysql-core';

/**
 * @description: helper columns to reduce repeating in create schema
 * @var created_at: field to present the time a field is created
 * @var updated_at: field to present the time a field is updated,
 *  in usual a record is create, updated_at is equals to created_at
 */
export const timestamps = {
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
};
