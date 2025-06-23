import { GetCommentResponseDto } from '@dtos/comment/get-all-comment-response.dto';
import { CommentStatus } from '@enum/status/comment-status.enum';
import { DrizzleAsyncProvider } from '@helper-modules/database/drizzle.provider';
import { SearchService } from '@helper-modules/services/search.service';
import { UtilityService } from '@helper-modules/services/utility.service';
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
import { comments, users } from '@schema';
import { and, asc, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);
  constructor(
    @Inject(DrizzleAsyncProvider) private db: MySql2Database<any>,
    private searchService: SearchService,
    private utilityService: UtilityService,
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

  async getCommentsByPost(
    postId: number,
    limit: number,
    offset: number,
  ): Promise<GetCommentResponseDto[]> {
    // 1. Get flat comment by post id
    const flatComments: GetCommentResponseDto[] = await this.getCommentByPostId(
      postId,
      limit,
      offset,
    );

    // 2. Create map of comment
    const map = new Map<number, GetCommentResponseDto>();
    const roots: GetCommentResponseDto[] = [];

    // 3. Set the root comment for post
    for (const comment of flatComments) {
      map.set(comment.id, { ...comment, replies: [] });
    }

    // 4. Set the child comment in post
    for (const comment of flatComments) {
      const current = map.get(comment.id)!;
      if (comment.parentId === null) {
        roots.push(current);
      } else {
        const parent = map.get(comment.parentId);
        if (parent) parent.replies.push(current);
      }
    }

    return roots;
  }

  private async getCommentByPostId(
    postId: number,
    limit: number,
    offset: number,
  ): Promise<GetCommentResponseDto[]> {
    // 1. Get pagination
    const { skip, take } = this.utilityService.getPagination(offset, limit);

    // 2. Get all comment
    const rows = await this.db
      .select({
        id: comments.id,
        content: comments.content,
        authorId: comments.userId,
        authorName: users.username,
        createdAt: comments.created_at,
        parentId: comments.commentId,
      })
      .from(comments)
      // đây 
      .leftJoin(users, eq(users.id, comments.userId))
      .where(
        and(
          eq(comments.postId, postId),
          eq(comments.status, CommentStatus.ACTIVE),
        ),
      )
      .limit(take)
      .offset(skip)
      .orderBy(asc(comments.created_at));

    // cast and return
    return rows as GetCommentResponseDto[];
  }
}
