import { GetCommentResponseDto } from '@comment/dto/get-all-comment-response.dto';
import { Comment } from '@comment/entities/comments.entity';
import { CommentErrorMessage } from '@comment/messages/comment.error-messages';
import { CommentMessageLog } from '@comment/messages/comment.messages-log';
import { CommentRepository } from '@comment/repositories/comment.repository';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UtilityService } from '@services/utility.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);
  constructor(
    private utilityService: UtilityService,
    private readonly commentRepo: CommentRepository,
  ) {}

  async createComment(
    postID: number,
    userID: number,
    content: string,
  ): Promise<Comment> {
    try {
      // 1. Create comment by post ID, user ID, conent
      const comment: Comment = await this.commentRepo.createComment(
        postID,
        userID,
        content,
      );

      // 2. Check create comment result
      if (!comment) {
        this.logger.error(CommentMessageLog.CANNOT_CREATE_COMMENT);
        throw new InternalServerErrorException(
          CommentErrorMessage.CANNOT_CREATE_COMMENT,
        );
      }

      // 3. Returning comment
      return comment;
    } catch (e) {
      this.logger.error(e);
      throw e;
    } finally {
      this.logger.log('Comment created', {
        userId: userID,
        postId: postID,
        content,
      });
    }
  }

  async removeComment(
    commentID: number,
    postID: number,
    userID: number,
  ): Promise<Comment> {
    try {
      // 1. Get comment by comment ID, post ID, user ID
      const comment: Comment = await this.getCommentByFilter({
        commentID,
        postID,
        userID,
      });

      // 2. Remove comment
      const removeComment: boolean = await this.commentRepo.removeComment(
        comment.id,
      );

      // 3. Check romve comment result
      if (!removeComment) {
        this.logger.error(CommentMessageLog.CANNOT_DELETE_COMMENT);
        throw new InternalServerErrorException(
          CommentErrorMessage.CANNOT_DELETE_COMMENT,
        );
      }

      // 4. Returning comment removed
      return this.getCommentByFilter({ commentID: comment.id, postID, userID });
    } catch (e) {
      this.logger.error(e);
      throw e;
    } finally {
      this.logger.log('Comment deleted', {
        commentID,
        postID,
        userID,
      });
    }
  }

  async updateComment(
    commentID: number,
    content: string,
    userID: number,
  ): Promise<Comment> {
    try {
      // 1. Get comment by comment ID, user ID
      const comment: Comment = await this.getCommentByFilter({
        commentID,
        userID,
      });

      // 2. Update comment
      const updateResult: boolean = await this.commentRepo.updateComment(
        comment.id,
        content,
      );

      // 3. Check update comment result
      if (!updateResult) {
        this.logger.error(CommentMessageLog.CANNOT_UPDATE_COMMENT);
        throw new InternalServerErrorException(
          CommentErrorMessage.CANNOT_UPDATE_COMMENT,
        );
      }

      // 4. Returning comment updated
      return await this.getCommentByFilter({
        commentID: comment.id,
        userID,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    } finally {
      this.logger.log('Comment updated', {
        commentID,
        content,
        userID,
      });
    }
  }

  async replyComment(
    postID: number,
    userID: number,
    parentCommentID: number,
    content: string,
  ): Promise<Comment> {
    try {
      // 1. Check exist parent comment
      const parentComment: Comment = await this.getCommentByFilter({
        commentID: parentCommentID,
        postID,
      });

      // 2. Check if parent comment post ID is equal to post ID
      if (parentComment.post.id !== postID) {
        this.logger.warn(CommentMessageLog.CANNOT_REPLY_COMMENT);
        throw new BadRequestException(CommentErrorMessage.CANNOT_REPLY_COMMENT);
      }

      // 3. Reply comment
      const replyComment: Comment = await this.commentRepo.replyComment(
        postID,
        userID,
        parentCommentID,
        content,
      );

      // 4. Check reply comment created result
      if (!replyComment) {
        this.logger.error(CommentMessageLog.CANNOT_REPLY_COMMENT);
        throw new InternalServerErrorException(
          CommentErrorMessage.CANNOT_REPLY_COMMENT,
        );
      }

      // 5. Returning reply comment
      return replyComment;
    } catch (e) {
      this.logger.error(e);
      throw e;
    } finally {
      this.logger.log('Comment reply', {
        postID,
        userID,
        parentCommentID,
        content,
      });
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
    postID: number,
    limit: number,
    offset: number,
  ): Promise<GetCommentResponseDto[]> {
    // 1. Get pagination
    const { skip, take } = this.utilityService.getPagination(offset, limit);

    // 2. Get all comment
    const comments: Comment[] = await this.commentRepo.getCommentByPostIDPaging(
      postID,
      skip,
      take,
    );

    // 3. Create response mapping with class transformer
    const response: GetCommentResponseDto[] = comments.map((comment) =>
      plainToInstance(GetCommentResponseDto, {
        id: comment.id,
        content: comment.content,
        authorId: comment.user.id,
        authorName: comment.user.username,
        createdAt: comment.createdAt,
        parentId: comment.parentComment?.id || null,
      }),
    );

    // 4. Returning response
    return response;
  }

  async getCommentByFilter(filter: {
    commentID?: number;
    postID?: number;
    userID?: number;
  }): Promise<Comment> {
    // 1. Get comment
    const comment: Comment | null =
      await this.commentRepo.getCommentByFilter(filter);

    // 2. Check comment is exist
    if (!comment) {
      this.logger.error(CommentMessageLog.COMMENT_NOT_FOUND);
      throw new InternalServerErrorException(
        CommentErrorMessage.COMMENT_NOT_FOUND,
      );
    }

    // 3. Returning comment
    return comment;
  }
}
