import { CommentService } from '@core-modules/forum/comment/comment.service';
import { HasRole } from '@decorator/roles.decorator';
import { GetUser } from '@decorator/user.decorator';
import { CreateCommentRequestDto } from '@dtos/comment/create-comment-request.dto';
import { GetAllCommentRequest } from '@dtos/comment/get-all-comment-request.dto';
import { RemoveCommentRequestDto } from '@dtos/comment/remove-comment-request.dto';
import { ReplyCommentRequestDto } from '@dtos/comment/reply-comment-request.dto';
import { UpdateCommentRequestDto } from '@dtos/comment/update-comment-request.dto';
import { ApiResponse } from '@dtos/response/ApiResponse/ApiResponse';
import { GetCommentResponseDto } from '@dtos/comment/get-all-comment-response.dto';
import { Role } from '@enum/role.enum';
import { CatchEverythingFilter } from '@filter/exception.filter';
import { JwtAuthGuard } from '@guard/jwt-auth.guard';
import { RolesGuard } from '@guard/roles.guard';
import { JwtPayload } from '@interfaces';
import { CommentNotifyMessage } from '@message/comment-message';
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

@Controller('comment')
@ApiBearerAuth('jwt')
@ApiTags('Comment')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRole(Role.ADMIN, Role.ADMIN)
@UseFilters(CatchEverythingFilter)
export class CommentController {
  private readonly logger = new Logger(CommentController.name);

  constructor(private commentService: CommentService) {}

  @Post('create')
  @ApiOperation({ summary: 'Tạo bình luận cho bài viết' })
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
    return this.commentService.updateComment(commentId, content, user.sub);
  }

  @Delete('remove')
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
