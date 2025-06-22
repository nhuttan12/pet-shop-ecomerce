import { CommentStatus } from '@enum/status/comment-status.enum';
import { DrizzleAsyncProvider } from '@helper-modules/database/drizzle.provider';
import { SearchService } from '@helper-modules/services/search.service';
import {
  CommentErrorMessage,
  CommentMessageLog,
} from '@message/comment-message';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { comments } from '@schema';
import { and, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);
  constructor(
    @Inject(DrizzleAsyncProvider) private db: MySql2Database<any>,
    private searchService: SearchService,
  ) {}
  async createComment(
    postId: number,
    userId: number,
    content: string,
  ): Promise<Comment> {
    try {
      const comment: { id: number }[] = await this.db.transaction(
        async (tx) => {
          return await tx
            .insert(comments)
            .values({
              postId,
              userId,
              content,
              created_at: new Date(),
            })
            .$returningId();
        },
      );

      return await this.searchService.findOneOrThrow(
        this.db,
        comments,
        eq(comments.id, comment[0].id),
      );
    } catch (e) {
      this.logger.error(e);
      throw e;
    } finally {
      this.logger.log(
        `Comment created with User Id: ${userId} - Post Id: ${postId} - Content: ${content}`,
      );
    }
  }

  async removeComment(
    commentId: number,
    postId: number,
    userId: number,
  ): Promise<Comment> {
    try {
      await this.searchService.findOneOrThrow(
        this.db,
        comments,
        and(
          eq(comments.id, commentId),
          eq(comments.postId, postId),
          eq(comments.userId, userId),
        ),
      );

      const comment = await this.db.transaction(async (tx) => {
        return await tx
          .update(comments)
          .set({ status: CommentStatus.REMOVED, created_at: new Date() })
          .where(eq(comments.id, commentId));
      });

      if (!comment) {
        this.logger.error(CommentMessageLog.CANNOT_DELETE_COMMENT);
        throw new InternalServerErrorException(
          CommentErrorMessage.CANNOT_DELETE_COMMENT,
        );
      }

      return this.searchService.findOneOrThrow(
        this.db,
        comments,
        eq(comments.id, commentId),
      );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  async updateComment(
    commentId: number,
    content: string,
    userId: number,
  ): Promise<Comment> {
    try {
      await this.searchService.findOneOrThrow(
        this.db,
        comments,
        and(eq(comments.id, commentId), eq(comments.userId, userId)),
      );

      const comment = await this.db.transaction(async (tx) => {
        return await tx
          .update(comments)
          .set({ content, updated_at: new Date() })
          .where(eq(comments.id, commentId));
      });

      if (!comment) {
        this.logger.error(CommentMessageLog.CANNOT_UPDATE_COMMENT);
        throw new InternalServerErrorException(
          CommentErrorMessage.CANNOT_UPDATE_COMMENT,
        );
      }

      return this.searchService.findOneOrThrow(
        this.db,
        comments,
        eq(comments.id, commentId),
      );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async replyComment(
    postId: number,
    userId: number,
    parentCommentId: number,
    content: string,
  ): Promise<Comment> {
    try {
      await this.searchService.findOneOrThrow(
        this.db,
        comments,
        and(eq(comments.id, parentCommentId), eq(comments.postId, postId)),
      );

      const [comment]: { id: number }[] = await this.db.transaction(
        async (tx) => {
          return await tx
            .insert(comments)
            .values({
              postId,
              userId,
              commentId: parentCommentId,
              content,
              created_at: new Date(),
            })
            .$returningId();
        },
      );

      if (!comment) {
        this.logger.error(CommentMessageLog.CANNOT_REPLY_COMMENT);
        throw new InternalServerErrorException(
          CommentErrorMessage.CANNOT_REPLY_COMMENT,
        );
      }

      return this.searchService.findOneOrThrow(
        this.db,
        comments,
        eq(comments.id, comment.id),
      );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
