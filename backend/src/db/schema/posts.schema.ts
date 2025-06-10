import { PostStatus } from '@enum/status/posts-status.enum';
import { timestamps } from 'db/helper/timestamp';
import { postEditRequests } from 'db/schema/post-edit-request.schema';
import { users } from 'db/schema/users.schema';
import { relations } from 'drizzle-orm';
import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';

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
  hasPendingEditRequest: boolean('has_pending_edit_request')
    .default(false)
    .notNull(),
  ...timestamps,
});

export const postToEditPostRequests = relations(posts, ({ many }) => ({
  postEditRequest: many(postEditRequests),
}));
