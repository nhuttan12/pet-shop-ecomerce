import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { PostEditRequestStatus } from '@enum/status/post-edit-request-status.enum';
import { timestamps } from '@db-helper/timestamp';
import { users, posts } from '@schema';

export const postEditRequests = mysqlTable('post_edit_request', {
  id: int('id').notNull().primaryKey().autoincrement(),
  postId: int('post_id')
    .notNull()
    .references(() => posts.id),
  employeeId: int('employee_id')
    .notNull()
    .references(() => users.id),
  status: mysqlEnum(
    Object.values(PostEditRequestStatus) as [string, ...string[]],
  )
    .default(PostEditRequestStatus.PENDING)
    .notNull(),
  contentSuggested: text('content_suggested'),
  reason: text('reason').notNull(),
  ...timestamps,
  resolvedAt: timestamp('resolved_at'),
});
