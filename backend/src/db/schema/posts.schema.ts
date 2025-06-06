import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';
import { users } from './users.schema';
import { PostStatus } from 'src/helper/enum/status/posts-status.enum';
import { timestamps } from '../helper/timestamp';

export const posts = mysqlTable('posts', {
  id: int().primaryKey().notNull().autoincrement(),
  title: varchar('title', { length: 255 }),
  content: text('content').notNull(),
  authorId: int('author_id')
    .notNull()
    .references(() => users.id),
  status: mysqlEnum(
    Object.values(PostStatus) as [string, ...string[]],
  ).notNull(),
  ...timestamps,
});
