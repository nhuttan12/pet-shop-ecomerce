import { CommentResponseDto } from '@comment/dto/comment-response.dto';
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
import { CreateCommentRequestDto } from '@comment/dto/create-comment-request.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ReplyCommentRequestDto } from '@comment/dto/reply-comment-request.dto';
import { UpdateCommentRequestDto } from '@comment/dto/update-comment-request.dto';
import { RemoveCommentRequestDto } from '@comment/dto/remove-comment-request.dto';
import { GetAllCommentRequest } from '@comment/dto/get-all-comment-request.dto';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private utilityService: UtilityService,
    private readonly commentRepo: CommentRepository,
  ) {}

  async removeComment(
    request: RemoveCommentRequestDto,
    userID: number,
  ): Promise<CommentResponseDto> {
    try {
      // 1. Get comment by comment ID, post ID, user ID
      this.logger.verbose('Get comment by comment ID, post ID, user ID');
      const comment: Comment = await this.getCommentByFilter({
        commentID: request.commentID,
        postID: request.postID,
        userID,
      });
      this.utilityService.logPretty(
        'Get comment by comment ID, post ID, user ID',
        comment,
      );

      // 2. Remove comment
      this.logger.verbose('Remove comment');
      const removeComment: boolean = await this.commentRepo.removeComment(
        comment.id,
      );
      this.utilityService.logPretty('Remove comment', removeComment);

      // 3. Check romve comment result
      if (!removeComment) {
        this.logger.error(CommentMessageLog.CANNOT_DELETE_COMMENT);
        throw new InternalServerErrorException(
          CommentErrorMessage.CANNOT_DELETE_COMMENT,
        );
      }

      // 4. Get comment removed
      this.logger.verbose('Get comment removed');
      const commentRemoved: Comment = await this.getCommentByFilter({
        commentID: comment.id,
        postID: request.postID,
        userID,
      });
      this.utilityService.logPretty('Comment removed', commentRemoved);

      // 5. Mapping comment to comment response dto
      this.logger.verbose('Mapping comment to comment response dto');
      const commentResponseDto: CommentResponseDto = this.mapper.map(
        commentRemoved,
        Comment,
        CommentResponseDto,
      );
      this.utilityService.logPretty(
        'Mapping comment to comment response dto',
        commentResponseDto,
      );

      // 6. Returning comment removed
      return commentResponseDto;
    } catch (e) {
      this.logger.error(e);
      throw e;
    } finally {
      this.logger.log('Comment deleted', {
        request,
        userID,
      });
    }
  }

  async createComment(
    request: CreateCommentRequestDto,
    userID: number,
  ): Promise<CommentResponseDto> {
    try {
      // 1. Create comment by post ID, user ID, conent
      const comment: Comment = await this.commentRepo.createComment(
        request.postID,
        userID,
        request.content,
      );

      // 2. Check create comment result
      if (!comment) {
        this.logger.error(CommentMessageLog.CANNOT_CREATE_COMMENT);
        throw new InternalServerErrorException(
          CommentErrorMessage.CANNOT_CREATE_COMMENT,
        );
      }

      // 3. Mapping comment to comment response dto
      const commentResponseDto: CommentResponseDto = this.mapper.map(
        comment,
        Comment,
        CommentResponseDto,
      );

      // 4. Returning comment created
      return commentResponseDto;
    } catch (e) {
      this.logger.error(e);
      throw e;
    } finally {
      this.logger.log('Comment created', {
        userID: userID,
        postID: request.postID,
        content: request.content,
      });
    }
  }

  async updateComment(
    request: UpdateCommentRequestDto,
    userID: number,
  ): Promise<CommentResponseDto> {
    try {
      // 1. Get comment by comment ID, user ID
      this.logger.verbose('Get comment by comment ID, user ID');
      const comment: Comment = await this.getCommentByFilter({
        commentID: request.commentID,
        userID,
      });
      this.utilityService.logPretty(
        'Get comment by comment ID, user ID',
        comment,
      );

      // 2. Update comment
      this.logger.verbose('Update comment');
      const updateResult: boolean = await this.commentRepo.updateComment(
        comment.id,
        request.content,
      );
      this.utilityService.logPretty('Update comment', updateResult);

      // 3. Check update comment result
      this.logger.verbose('Check update comment result');
      if (!updateResult) {
        this.logger.error(CommentMessageLog.CANNOT_UPDATE_COMMENT);
        throw new InternalServerErrorException(
          CommentErrorMessage.CANNOT_UPDATE_COMMENT,
        );
      }

      // 4. Mapping comment to comment response dto
      this.logger.verbose('Mapping comment to comment response dto');
      const commentResponseDto: CommentResponseDto = this.mapper.map(
        comment,
        Comment,
        CommentResponseDto,
      );
      this.utilityService.logPretty(
        'Mapping comment to comment response dto',
        commentResponseDto,
      );

      // 4. Returning comment updated
      return commentResponseDto;
    } catch (e) {
      this.logger.error(e);
      throw e;
    } finally {
      this.utilityService.logPretty('Comment updated', {
        userID,
        request,
      });
    }
  }

  async replyComment(
    request: ReplyCommentRequestDto,
    userID: number,
  ): Promise<CommentResponseDto> {
    try {
      // 1. Check exist parent comment
      this.logger.verbose('Check exist parent comment');
      const parentComment: Comment = await this.getCommentByFilter({
        commentID: request.parentCommentID,
        postID: request.postID,
      });
      this.utilityService.logPretty(
        'Check exist parent comment',
        parentComment,
      );

      // 2. Check if parent comment post ID is equal to post ID
      this.logger.verbose(
        'Check if parent comment post ID is equal to post ID',
      );
      if (parentComment.post.id !== request.postID) {
        this.logger.warn(CommentMessageLog.CANNOT_REPLY_COMMENT);
        throw new BadRequestException(CommentErrorMessage.CANNOT_REPLY_COMMENT);
      }

      // 3. Reply comment
      this.logger.verbose('Reply comment');
      const replyComment: Comment = await this.commentRepo.replyComment(
        request.postID,
        userID,
        request.parentCommentID,
        request.content,
      );
      this.utilityService.logPretty('Reply comment', replyComment);

      // 4. Check reply comment created result
      this.logger.verbose('Check reply comment created result');
      if (!replyComment) {
        this.logger.error(CommentMessageLog.CANNOT_REPLY_COMMENT);
        throw new InternalServerErrorException(
          CommentErrorMessage.CANNOT_REPLY_COMMENT,
        );
      }

      // 5. Mapping reply comment to comment response dto
      this.logger.verbose('Mapping reply comment to comment response dto');
      const replyCommentResponseDto: CommentResponseDto = this.mapper.map(
        replyComment,
        Comment,
        CommentResponseDto,
      );
      this.utilityService.logPretty(
        'Mapping reply comment to comment response dto',
        replyCommentResponseDto,
      );

      // 5. Returning reply comment mapping
      this.logger.verbose('Returning reply comment mapping');
      return replyCommentResponseDto;
    } catch (e) {
      this.logger.error(e);
      throw e;
    } finally {
      this.utilityService.logPretty('Comment reply', {
        userID,
        request,
      });
    }
  }

  async getCommentsByPost(
    request: GetAllCommentRequest,
  ): Promise<CommentResponseDto[]> {
    try {
      // 1. Get flat comment by post id
      this.logger.verbose('Get flat comment by post id');
      const flatComments: CommentResponseDto[] = await this.getCommentByPostId(
        request.postID,
        request.limit,
        request.page,
      );
      this.utilityService.logPretty(
        'Get flat comment by post id',
        flatComments,
      );

      // 2. Create map of comment
      this.logger.verbose('Create map of comment');
      const map = new Map<number, CommentResponseDto>();
      const roots: CommentResponseDto[] = [];

      // 3. Set the root comment for post
      this.logger.verbose('Set the root comment for post');
      for (const comment of flatComments) {
        map.set(comment.id, { ...comment, replies: [] });
      }
      this.utilityService.logPretty('Set the root comment for post', map);

      // 4. Set the child comment in post
      this.logger.verbose('Set the child comment in post');
      for (const comment of flatComments) {
        const current = map.get(comment.id)!;
        if (comment.parentID === null) {
          roots.push(current);
        } else {
          const parent = map.get(comment.parentID);
          if (parent) parent.replies.push(current);
        }
      }

      // 5. Returning roots
      this.logger.verbose('Returning roots');
      return roots;
    } catch (error: unknown) {
      this.logger.error(error);
      throw error;
    } finally {
      this.utilityService.logPretty('Get comments by post', request);
    }
  }

  private async getCommentByPostId(
    postID: number,
    limit: number,
    offset: number,
  ): Promise<CommentResponseDto[]> {
    // 1. Get pagination
    const { skip, take } = this.utilityService.getPagination(offset, limit);

    // 2. Get all comment
    const comments: Comment[] = await this.commentRepo.getCommentByPostIDPaging(
      postID,
      skip,
      take,
    );

    // 3. Mapping comment to comment response dto
    const response: CommentResponseDto[] = this.mapper.mapArray(
      comments,
      Comment,
      CommentResponseDto,
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
