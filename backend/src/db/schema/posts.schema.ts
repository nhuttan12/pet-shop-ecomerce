import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';
import { users } from './users.schema';
import { PostStatus } from 'src/helper/enum/posts-status.enum';

export const posts = mysqlTable('posts', {
  id: int().primaryKey().notNull(),
  title: varchar({ length: 255 }),
  content: text().notNull(),
  authorId: int('author_id')
    .notNull()
    .references(() => users.id),
  status: mysqlEnum(Object.values(PostStatus) as [string, ...string[]]),
});
