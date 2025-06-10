import { timestamps } from '@db-helper/timestamp';
import { PostReportStatus } from '@enum/status/post-report-status.enum';
import { posts, users } from '@schema';
import { int, mysqlEnum, mysqlTable, text } from 'drizzle-orm/mysql-core';

export const postReports = mysqlTable('post_report', {
  id: int().primaryKey().notNull().autoincrement(),
  postId: int('post_id')
    .references(() => posts.id)
    .notNull(),
  userId: int('user_id')
    .references(() => users.id)
    .notNull(),
  status: mysqlEnum(Object.values(PostReportStatus) as [string, ...string[]])
    .notNull()
    .default(PostReportStatus.PENDING),
  description: text('description').notNull(),
  createdAt: timestamps.created_at,
});
