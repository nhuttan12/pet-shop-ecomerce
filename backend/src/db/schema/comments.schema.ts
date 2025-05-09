import { int, mysqlEnum, mysqlTable, text } from 'drizzle-orm/mysql-core';
import { users } from './users.schema';
import { CommentStatus } from 'src/helper/enum/comment-status.enum';
import { relations } from 'drizzle-orm';

export const comments = mysqlTable('comments', {
  id: int().primaryKey().notNull().autoincrement(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id),
  commentId: int('comment_id'),
  content: text(),
  status: mysqlEnum(Object.values(CommentStatus) as [string, ...string[]]),
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
