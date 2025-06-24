import { postReports } from './post-report.schema';
import { PostStatus } from '@enum/status/posts-status.enum';
import { timestamps } from 'common/db-helper/timestamp';
import { postEditRequests } from 'post/entities/post-edit-request.schema';
import { users } from '@user/entites/users.schema';
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
  title: varchar('title', { length: 255 }).notNull(),
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

export const postToPostReports = relations(posts, ({ many }) => ({
  postReports: many(postReports),
}));
