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
import { HasRole } from 'src/helper/decorator/roles.decorator';
import { GetUser } from 'src/helper/decorator/user.decorator';
import { CreatePostRequestDto } from 'src/helper/dto/post/create-post-request.dto';
import { DeletePostRequestDto } from 'src/helper/dto/post/delete-post-request.dto';
import { EditPostRequestDto } from 'src/helper/dto/post/edit-post-request.dto';
import { GetAllPostsRequestDto } from 'src/helper/dto/post/get-all-posts-request.dto';
import { GetPostById } from 'src/helper/dto/post/get-post-by-id.request.dto';
import { PostResponse } from 'src/helper/dto/post/post-response.dto';
import { ApiResponse } from 'src/helper/dto/response/ApiResponse/ApiResponse';
import { Role } from 'src/helper/enum/role.enum';
import { CatchEverythingFilter } from 'src/helper/filter/exception.filter';
import { JwtAuthGuard } from 'src/helper/guard/jwt-auth.guard';
import { RolesGuard } from 'src/helper/guard/roles.guard';
import { NotifyMessage } from 'src/helper/message/notify-message';
import { PostService } from './post.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';

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
  ): Promise<ApiResponse<PostResponse[]>> {
    const posts = await this.postService.getAllPosts(limit, page);
    this.logger.debug(`Posts: ${JSON.stringify(posts)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_POST_SUCCESSFUL,
      data: posts,
    };
  }

  @Get('list/:postId')
  @ApiOperation({ summary: 'Lấy bài viết theo postId và userId' })
  @ApiParam({ name: 'postId', type: Number, description: 'ID bài viết' })
  @SwaggerApiResponse({
    status: 200,
    description: NotifyMessage.GET_POST_SUCCESSFUL,
  })
  async getPostForUsers(
    @Param() { postId }: GetPostById,
    @GetUser() userId: number,
  ): Promise<ApiResponse<PostResponse[]>> {
    const posts = await this.postService.getAllPosts(postId, userId);
    this.logger.debug(`Post: ${JSON.stringify(posts)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_POST_SUCCESSFUL,
      data: posts,
    };
  }

  @Post('/create')
  @ApiOperation({ summary: 'Tạo bài viết mới' })
  @ApiBody({ type: CreatePostRequestDto })
  @SwaggerApiResponse({
    status: 201,
    description: NotifyMessage.CREATE_POST_SUCCESSFUL,
  })
  async createPost(
    @Body() dto: CreatePostRequestDto,
  ): Promise<ApiResponse<PostResponse>> {
    const post = await this.postService.createPost(dto);
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
    @Body() editPostDto: EditPostRequestDto,
  ): Promise<ApiResponse<PostResponse>> {
    const post = await this.postService.editPost(postId, editPostDto);
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
}
