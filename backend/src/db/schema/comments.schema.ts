import { int, mysqlEnum, mysqlTable, text } from 'drizzle-orm/mysql-core';
import { CommentStatus } from '@enum/status/comment-status.enum';
import { relations } from 'drizzle-orm';
import { timestamps } from '@db-helper/timestamp';
import { posts, users } from '@schema';

export const comments = mysqlTable('comments', {
  id: int().primaryKey().notNull().autoincrement(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id),
  postId: int('post_id')
    .notNull()
    .references(() => posts.id),
  commentId: int('comment_id'),
  content: text(),
  status: mysqlEnum(
    Object.values(CommentStatus) as [string, ...string[]],
  ).default(CommentStatus.ACTIVE),
  ...timestamps,
});

export const CommentsRelation = relations(comments, ({ one }) => ({
  users: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  parentComment: one(comments, {
    fields: [comments.commentId],
    references: [comments.id],
  }),
}));
