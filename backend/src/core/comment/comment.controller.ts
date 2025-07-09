import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { ApiResponse } from '@api-response/ApiResponse';
import { CommentService } from '@comment/comment.service';
import { CreateCommentRequestDto } from '@comment/dto/create-comment-request.dto';
import { GetAllCommentRequest } from '@comment/dto/get-all-comment-request.dto';
import { GetCommentResponseDto } from '@comment/dto/get-all-comment-response.dto';
import { RemoveCommentRequestDto } from '@comment/dto/remove-comment-request.dto';
import { ReplyCommentRequestDto } from '@comment/dto/reply-comment-request.dto';
import { UpdateCommentRequestDto } from '@comment/dto/update-comment-request.dto';
import { CommentNotifyMessage } from '@comment/messages/comment.notify-messages';
import { HasRole } from '@decorators/roles.decorator';
import { GetUser } from '@decorators/user.decorator';
import { CatchEverythingFilter } from '@filters/exception.filter';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { RoleName } from '@role/enums/role.enum';

@Controller('comment')
@ApiBearerAuth('jwt')
@ApiTags('Comment')
@HasRole(RoleName.CUSTOMER, RoleName.ADMIN) // Allow USER and ADMIN roles for all endpoints
@UseFilters(CatchEverythingFilter)
export class CommentController {
  private readonly logger = new Logger(CommentController.name);

  constructor(private commentService: CommentService) {}

  @Post('create')
  @ApiOperation({ summary: 'Tạo bình luận cho bài viết' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SwaggerApiResponse({
    status: 201,
    description: 'Bình luận được tạo thành công',
  })
  @ApiBody({
    type: CreateCommentRequestDto,
    description: 'Dữ liệu để tạo bình luận cho một bài viết',
    examples: {
      default: {
        summary: 'Ví dụ bình luận mới',
        value: {
          content: 'Bài viết rất hữu ích!',
          postId: 10,
        },
      },
    },
  })
  async createComment(
    @Body() { content, postId }: CreateCommentRequestDto,
    @GetUser() user: JwtPayload,
  ) {
    this.logger.debug(
      `Creating comment for post ${postId} by user ${user.sub}`,
    );
    return this.commentService.createComment(postId, user.sub, content);
  }

  @Post('reply')
  @ApiOperation({ summary: 'Phản hồi bình luận (reply)' })
  @SwaggerApiResponse({
    status: 201,
    description: 'Phản hồi bình luận thành công',
  })
  @ApiBody({
    type: ReplyCommentRequestDto,
    description: 'Dữ liệu để phản hồi một bình luận có sẵn',
    examples: {
      default: {
        summary: 'Ví dụ phản hồi bình luận',
        value: {
          content: 'Tôi hoàn toàn đồng tình với bạn!',
          postId: 10,
          parentCommentId: 5,
        },
      },
    },
  })
  async replyComment(
    @Body()
    { content, parentCommentId, postId }: ReplyCommentRequestDto,
    @GetUser() user: JwtPayload,
  ) {
    this.logger.debug(
      `Replying to comment ${parentCommentId} for post ${postId} by user ${user.sub}`,
    );
    return this.commentService.replyComment(
      postId,
      user.sub,
      parentCommentId,
      content,
    );
  }

  @Patch('edit')
  @ApiOperation({ summary: 'Cập nhật nội dung bình luận' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Cập nhật bình luận thành công',
  })
  @ApiBody({
    type: UpdateCommentRequestDto,
    description: 'Dữ liệu để cập nhật nội dung bình luận',
    examples: {
      default: {
        summary: 'Ví dụ chỉnh sửa bình luận',
        value: {
          content: 'Tôi đã chỉnh sửa bình luận trước đó.',
          commentId: 12,
        },
      },
    },
  })
  async updateComment(
    @Body() { content, commentId }: UpdateCommentRequestDto,
    @GetUser() user: JwtPayload,
  ) {
    this.logger.debug(`Updating comment ${commentId} by user ${user.sub}`);
    return this.commentService.updateComment(commentId, content, user.sub);
  }

  @Delete('remove')
  @HasRole(RoleName.ADMIN) // Restrict to ADMIN only for deleting comments
  @ApiOperation({ summary: 'Xoá (ẩn) bình luận' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Xoá bình luận thành công',
  })
  @ApiBody({
    type: RemoveCommentRequestDto,
    description: 'Dữ liệu để xoá (ẩn) một bình luận khỏi bài viết',
    examples: {
      default: {
        summary: 'Ví dụ xoá bình luận',
        value: {
          commentId: 12,
          postId: 10,
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async removeComment(
    @Body() { commentId, postId }: RemoveCommentRequestDto,
    @GetUser() user: JwtPayload,
  ) {
    this.logger.debug(
      `Removing comment ${commentId} for post ${postId} by user ${user.sub}`,
    );
    return this.commentService.removeComment(commentId, postId, user.sub);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy tất cả bình luận của bài viết (bao gồm replies)',
  })
  async getComments(
    @Query() { limit, page, postId }: GetAllCommentRequest,
  ): Promise<ApiResponse<GetCommentResponseDto[]>> {
    const comment: GetCommentResponseDto[] =
      await this.commentService.getCommentsByPost(postId, limit, page);
    this.logger.debug(`Comment: ${JSON.stringify(comment)}`);

    return {
      statusCode: HttpStatus.OK,
      message: CommentNotifyMessage.GET_COMMENT_SUCCESSFUL,
      data: comment,
    };
  }
}
