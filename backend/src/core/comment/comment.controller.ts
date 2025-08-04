import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { ApiResponse } from '@api-response/ApiResponse';
import { CommentService } from '@comment/comment.service';
import { CreateCommentRequestDto } from '@comment/dto/create-comment-request.dto';
import { GetAllCommentRequest } from '@comment/dto/get-all-comment-request.dto';
import { CommentResponseDto } from '@comment/dto/comment-response.dto';
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
import { UtilityService } from '@services/utility.service';

@Controller('comment')
@ApiBearerAuth('jwt')
@ApiTags('Comment')
@HasRole(RoleName.CUSTOMER, RoleName.ADMIN) // Allow USER and ADMIN roles for all endpoints
@UseFilters(CatchEverythingFilter)
export class CommentController {
  private readonly logger = new Logger(CommentController.name);

  constructor(
    private readonly utilityService: UtilityService,
    private readonly commentService: CommentService,
  ) {}

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
    @Body() request: CreateCommentRequestDto,
    @GetUser() user: JwtPayload,
  ): Promise<ApiResponse<CommentResponseDto>> {
    // 1. Get request data from body
    this.logger.verbose('Get request data from body');
    this.utilityService.logPretty('Request data', request);

    // 2. Get user data from token
    this.logger.verbose('Get user data from token');
    this.utilityService.logPretty('User data', user);

    // 3. Create comment
    const comment: CommentResponseDto = await this.commentService.createComment(
      request,
      user.sub,
    );

    // 4. Create response
    this.logger.verbose('Create response');
    const response: ApiResponse<CommentResponseDto> = {
      statusCode: HttpStatus.CREATED,
      message: CommentNotifyMessage.CREATE_COMMENT_SUCCESSFUL,
      data: comment,
    };
    this.utilityService.logPretty('Response', response);

    // 5. Returning response to client
    return response;
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
    @Body() request: ReplyCommentRequestDto,
    @GetUser() user: JwtPayload,
  ): Promise<ApiResponse<CommentResponseDto>> {
    // 1. Get request data from body
    this.logger.verbose('Get request data from body');
    this.utilityService.logPretty('Request data', request);

    // 2. Get user data from token
    this.logger.verbose('Get user data from token');
    this.utilityService.logPretty('User data', user);

    // 3. Reply comment in service
    this.logger.verbose('Reply comment in service');
    const comment: CommentResponseDto = await this.commentService.replyComment(
      request,
      user.sub,
    );
    this.utilityService.logPretty('Reply comment in service', comment);

    // 4. Create response
    this.logger.verbose('Create response');
    const response: ApiResponse<CommentResponseDto> = {
      statusCode: HttpStatus.CREATED,
      message: CommentNotifyMessage.REPLY_COMMENT_SUCCESSFUL,
      data: comment,
    };
    this.utilityService.logPretty('Response', response);

    // 5. Returning response to client
    return response;
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
    @Body() request: UpdateCommentRequestDto,
    @GetUser() user: JwtPayload,
  ): Promise<ApiResponse<CommentResponseDto>> {
    // 1. Get request data from body
    this.logger.verbose('Get request data from body');
    this.utilityService.logPretty('Request data', request);

    // 2. Get user data from token
    this.logger.verbose('Get user data from token');
    this.utilityService.logPretty('User data', user);

    // 3. Update comment in service
    this.logger.verbose('Update comment in service');
    const comment: CommentResponseDto = await this.commentService.updateComment(
      request,
      user.sub,
    );
    this.utilityService.logPretty('Update comment in service', comment);

    // 4. Create response
    this.logger.verbose('Create response');
    const response: ApiResponse<CommentResponseDto> = {
      statusCode: HttpStatus.OK,
      message: CommentNotifyMessage.UPDATE_COMMENT_SUCCESSFUL,
      data: comment,
    };
    this.utilityService.logPretty('Response', response);

    // 5. Returning response to client
    this.logger.verbose('Returning response to client');
    return response;
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
    @Body() request: RemoveCommentRequestDto,
    @GetUser() user: JwtPayload,
  ): Promise<ApiResponse<CommentResponseDto>> {
    // 1. Get request data from body
    this.logger.verbose('Get request data from body');
    this.utilityService.logPretty('Request data', request);

    // 2. Get user data from token
    this.logger.verbose('Get user data from token');
    this.utilityService.logPretty('User data', user);

    // 3. Remove comment in service
    this.logger.verbose('Remove comment in service');
    const comment: CommentResponseDto = await this.commentService.removeComment(
      request,
      user.sub,
    );
    this.utilityService.logPretty('Remove comment in service', comment);

    // 4. Create response
    this.logger.verbose('Create response');
    const response: ApiResponse<CommentResponseDto> = {
      statusCode: HttpStatus.OK,
      message: CommentNotifyMessage.DELETE_COMMENT_SUCCESSFUL,
      data: comment,
    };
    this.utilityService.logPretty('Response', response);

    // 5. Returning response to client
    this.logger.verbose('Returning response to client');
    return response;
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy tất cả bình luận của bài viết (bao gồm replies)',
  })
  async getComments(
    @Query() request: GetAllCommentRequest,
  ): Promise<ApiResponse<CommentResponseDto[]>> {
    // 1. Get request data from query
    this.logger.verbose('Get request data from query');
    this.utilityService.logPretty('Request data', request);

    // 2. Get comments in service
    this.logger.verbose('Get comments in service');
    const comment: CommentResponseDto[] =
      await this.commentService.getCommentsByPost(request);
    this.utilityService.logPretty('Get comments in service', comment);

    // 3. Create response
    this.logger.verbose('Create response');
    const response: ApiResponse<CommentResponseDto[]> = {
      statusCode: HttpStatus.OK,
      message: CommentNotifyMessage.GET_COMMENT_SUCCESSFUL,
      data: comment,
    };
    this.utilityService.logPretty('Response', response);

    // 4. Returning response to client
    this.logger.verbose('Returning response to client');
    return response;
  }
}
