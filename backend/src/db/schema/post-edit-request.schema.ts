import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { PostEditRequestStatus } from 'src/helper/enum/status/post-edit-request-status.enum';
import { timestamps } from '../helper/timestamp';
import { posts } from './posts.schema';
import { users } from './users.schema';

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
  ),
  contentSuggested: text('content_suggested'),
  reason: text('reason').notNull(),
  ...timestamps,
  resolvedAt: timestamp('resolved_at').defaultNow().notNull(),
});
