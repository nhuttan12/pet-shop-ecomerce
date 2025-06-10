import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';
import { HasRole } from '@decorator/roles.decorator';
import { GetUser } from '@decorator/user.decorator';
import { CreatePostRequestDto } from '@dtos/post/create-post-request.dto';
import { DeletePostRequestDto } from '@dtos/post/delete-post-request.dto';
import { EditPostRequestDto } from '@dtos/post/edit-post-request.dto';
import { GetAllPostsRequestDto } from '@dtos/post/get-all-posts-request.dto';
import { PostResponse } from '@dtos/post/post-response.dto';
import { ApiResponse } from '@dtos/response/ApiResponse/ApiResponse';
import { Role } from '@enum/role.enum';
import { CatchEverythingFilter } from '@filter/exception.filter';
import { JwtAuthGuard } from '@guard/jwt-auth.guard';
import { RolesGuard } from '@guard/roles.guard';
import { JwtPayload } from '@interfaces';
import { NotifyMessage } from '@message/notify-message';
import { PostService } from '@core-modules/forum/post/post.service';
import { SendRequestChangingPostDto } from '@dtos/request-edit-post/send-request-edit.post.dto';

@Controller('post')
@ApiTags('Post')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRole(Role.USER, Role.ADMIN)
@UseFilters(CatchEverythingFilter)
export class PostController {
  private readonly logger = new Logger(PostController.name);
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bài viết (phân trang)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Số lượng bài viết mỗi trang',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Trang số',
  })
  @SwaggerApiResponse({
    status: 200,
    description: NotifyMessage.GET_POST_SUCCESSFUL,
  })
  async getAllPosts(
    @Query() { limit, page }: GetAllPostsRequestDto,
    @GetUser() user: JwtPayload,
  ): Promise<ApiResponse<PostResponse[]>> {
    let posts: PostResponse[] = [];
    if (user.role === (Role.ADMIN as string)) {
      posts = await this.postService.getAllPosts(limit, page);
    } else {
      posts = await this.postService.getAllPosts(limit, page, user.sub);
    }
    this.logger.debug(`Posts: ${JSON.stringify(posts)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_POST_SUCCESSFUL,
      data: posts,
    };
  }

  // @Get('list/:postId')
  // @ApiOperation({ summary: 'Lấy bài viết theo postId và userId' })
  // @ApiParam({ name: 'postId', type: Number, description: 'ID bài viết' })
  // @SwaggerApiResponse({
  //   status: 200,
  //   description: NotifyMessage.GET_POST_SUCCESSFUL,
  // })
  // async getPostForUsers(
  //   @Param() { postId }: GetPostById,
  //   @GetUser() userId: JwtPayload,
  // ): Promise<ApiResponse<PostResponse[]>> {
  //   const posts = await this.postService.getAllPosts(postId, userId.sub);
  //   this.logger.debug(`Post: ${JSON.stringify(posts)}`);

  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: NotifyMessage.GET_POST_SUCCESSFUL,
  //     data: posts,
  //   };
  // }

  @Post('/create')
  @ApiOperation({ summary: 'Tạo bài viết mới' })
  @ApiBody({ type: CreatePostRequestDto })
  @SwaggerApiResponse({
    status: 201,
    description: NotifyMessage.CREATE_POST_SUCCESSFUL,
  })
  async createPost(
    @GetUser() authorId: JwtPayload,
    @Body() dto: CreatePostRequestDto,
  ): Promise<ApiResponse<PostResponse>> {
    this.logger.debug(`Author: ${JSON.stringify(authorId)}`);
    const post = await this.postService.createPost(authorId.sub, dto);
    this.logger.debug(`Post: ${JSON.stringify(post)}`);

    return {
      statusCode: HttpStatus.CREATED,
      message: NotifyMessage.CREATE_POST_SUCCESSFUL,
      data: post,
    };
  }

  @Patch('edit/:postId')
  @ApiOperation({ summary: 'Chỉnh sửa bài viết' })
  @ApiParam({ name: 'postId', type: Number, description: 'ID bài viết' })
  @ApiBody({ type: EditPostRequestDto })
  @SwaggerApiResponse({
    status: 200,
    description: NotifyMessage.UPDATE_POST_SUCCESSFUL,
  })
  async editPost(
    @Param('postId', ParseIntPipe) postId: number,
    @GetUser() user: JwtPayload,
    @Body() editPostDto: EditPostRequestDto,
  ): Promise<ApiResponse<PostResponse>> {
    const post = await this.postService.editPost(postId, user.sub, editPostDto);
    this.logger.debug(`Post: ${JSON.stringify(post)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.UPDATE_POST_SUCCESSFUL,
      data: post,
    };
  }

  @Delete('remove/:postId')
  @ApiOperation({ summary: 'Xoá (ẩn) bài viết' })
  @ApiBody({ type: DeletePostRequestDto })
  @SwaggerApiResponse({
    status: 200,
    description: NotifyMessage.DELETE_POST_SUCCESSFUL,
  })
  async removePost(
    @Body() { postId }: DeletePostRequestDto,
  ): Promise<ApiResponse<PostResponse>> {
    const post = await this.postService.removePost(postId);
    this.logger.debug(`Post: ${JSON.stringify(post)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.DELETE_POST_SUCCESSFUL,
      data: post,
    };
  }

  @Post('request-edit/:postId')
  @ApiOperation({ summary: 'Gửi yêu cầu chỉnh sửa bài viết' })
  @ApiParam({ name: 'postId', type: Number, description: 'ID của bài viết' })
  @ApiBody({
    description: 'Thông tin lý do và nội dung chỉnh sửa gợi ý',
    type: SendRequestChangingPostDto,
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Gửi yêu cầu chỉnh sửa bài viết thành công',
  })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy bài viết',
  })
  @SwaggerApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Lỗi hệ thống khi gửi yêu cầu',
  })
  async sendRequestChangingPost({
    postId,
    reason,
    contentSuggested,
  }: SendRequestChangingPostDto): Promise<ApiResponse<void>> {
    await this.postService.sendRequestChangingPost(
      postId,
      reason,
      contentSuggested,
    );

    return {
      message: NotifyMessage.REQUEST_CHANGE_POST_SUCCESSFUL,
      statusCode: HttpStatus.OK,
    };
  }
}
