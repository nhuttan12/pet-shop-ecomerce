import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { ApiResponse } from '@api-response/ApiResponse';
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
import { CreatePostRequestDto } from '@post/dto/create-post-request.dto';
import { DeletePostRequestDto } from '@post/dto/delete-post-request.dto';
import { EditPostRequestDto } from '@post/dto/edit-post-request.dto';
import { GetAllPostReportsRequestDto } from '@post/dto/get-all-post-report-request.dto';
import { GetAllPostsRequestDto } from '@post/dto/get-all-posts-request.dto';
import { PostReportResponseDto } from '@post/dto/post-report-response.dto';
import { PostResponse } from '@post/dto/post-response.dto';
import { ReportPostRequestDto } from '@post/dto/report-post-request.dto';
import { SendRequestChangingPostDto } from '@post/dto/send-request-edit.post.dto';
import { PostNotifyMessage } from '@post/messages/post.notify-message';
import { PostEditRequestService } from '@post/post-edit-request.service';
import { PostReportService } from '@post/post-report.service';
import { PostService } from '@post/post.service';
import { RoleName } from '@role/enums/role.enum';
import { UtilityService } from '@services/utility.service';

@Controller('/post')
@ApiTags('Post')
@ApiBearerAuth('jwt')
@HasRole(RoleName.CUSTOMER, RoleName.ADMIN)
@UseFilters(CatchEverythingFilter)
export class PostController {
  private readonly logger = new Logger(PostController.name);

  constructor(
    private readonly utilityService: UtilityService,
    private readonly postService: PostService,
    private readonly postEditRequestSerivce: PostEditRequestService,
    private readonly postReportService: PostReportService,
  ) {}

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
    description: PostNotifyMessage.GET_POST_SUCCESSFUL,
  })
  async getAllPosts(
    @Query() request: GetAllPostsRequestDto,
  ): Promise<ApiResponse<PostResponse[]>> {
    // 1. Call get all posts in service
    this.logger.verbose('Call get all posts in service');
    const posts: PostResponse[] = await this.postService.getAllPosts(request);
    this.utilityService.logPretty('Call get all posts in service', posts);

    // 2. Create response
    this.logger.verbose('Create response for client');
    const response: ApiResponse<PostResponse[]> = {
      statusCode: HttpStatus.OK,
      message: PostNotifyMessage.GET_POST_SUCCESSFUL,
      data: posts,
    };
    this.utilityService.logPretty('Create response for client', response);

    // 3. Return response to client
    this.logger.verbose('Return response to client');
    return response;
  }

  @Post('/create')
  @ApiOperation({ summary: 'Tạo bài viết mới' })
  @ApiBody({ type: CreatePostRequestDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SwaggerApiResponse({
    status: 201,
    description: PostNotifyMessage.CREATE_POST_SUCCESSFUL,
  })
  async createPost(
    @Body() dto: CreatePostRequestDto,
    @GetUser() user: JwtPayload,
  ): Promise<ApiResponse<PostResponse>> {
    // 1. Get user from token
    this.logger.verbose('Get user from token');
    this.utilityService.logPretty('Get user from token', user);

    // 2. Create post
    this.logger.verbose('Create post');
    const post: PostResponse = await this.postService.createPost(user.sub, dto);
    this.utilityService.logPretty('Create post', post);

    // 3. Create response
    this.logger.verbose('Create response for client');
    const response: ApiResponse<PostResponse> = {
      statusCode: HttpStatus.CREATED,
      message: PostNotifyMessage.CREATE_POST_SUCCESSFUL,
      data: post,
    };
    this.utilityService.logPretty('Create response for client', response);

    // 4. Return response to client
    this.logger.verbose('Return response to client');
    return response;
  }

  @Patch('edit')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Chỉnh sửa bài viết' })
  @ApiParam({ name: 'postId', type: Number, description: 'ID bài viết' })
  @ApiBody({ type: EditPostRequestDto })
  @SwaggerApiResponse({
    status: 200,
    description: PostNotifyMessage.UPDATE_POST_SUCCESSFUL,
  })
  async editPost(
    @Body() editPostDto: EditPostRequestDto,
    @GetUser() user: JwtPayload,
  ): Promise<ApiResponse<PostResponse>> {
    // 1. Get user from token
    this.logger.verbose('Get user from token');
    this.utilityService.logPretty('Get user from token', user);

    // 2. Edit post
    this.logger.verbose('Update post');
    const post: PostResponse = await this.postService.editPost(
      user.sub,
      editPostDto,
    );
    this.utilityService.logPretty('Update post', post);

    // 3. Create response
    this.logger.verbose('Create response for client');
    const response: ApiResponse<PostResponse> = {
      statusCode: HttpStatus.OK,
      message: PostNotifyMessage.UPDATE_POST_SUCCESSFUL,
      data: post,
    };
    this.utilityService.logPretty('Create response for client', response);

    // 4. Return response to client
    this.logger.verbose('Return response to client');
    return response;
  }

  @Delete('remove')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Xoá (ẩn) bài viết' })
  @ApiBody({ type: DeletePostRequestDto })
  @SwaggerApiResponse({
    status: 200,
    description: PostNotifyMessage.DELETE_POST_SUCCESSFUL,
  })
  async removePost(
    @Body() request: DeletePostRequestDto,
    @GetUser() user: JwtPayload,
  ): Promise<ApiResponse<PostResponse>> {
    // 1. Get request from client
    this.logger.verbose('Get request from client');
    this.utilityService.logPretty('Get request from client', request);

    // 2. Get user from token
    this.logger.verbose('Get user from token');
    this.utilityService.logPretty('Get user from token', user);

    // 3. Call remove post in service
    this.logger.verbose('Call remove post in service');
    const post = await this.postService.removePost(request.postID, user.sub);
    this.utilityService.logPretty('Call remove post in service result', post);

    // 4. Create response
    this.logger.verbose('Create response for client');
    const response: ApiResponse<PostResponse> = {
      statusCode: HttpStatus.OK,
      message: PostNotifyMessage.DELETE_POST_SUCCESSFUL,
      data: post,
    };
    this.utilityService.logPretty('Create response for client', response);

    // 5. Return response to client
    this.logger.verbose('Return response to client');
    return response;
  }

  @Post('request-edit')
  @HasRole(RoleName.ADMIN)
  @ApiOperation({ summary: 'Gửi yêu cầu chỉnh sửa bài viết' })
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
  async sendRequestChangingPost(
    @Body() request: SendRequestChangingPostDto,
    @GetUser() user: JwtPayload,
  ): Promise<ApiResponse<void>> {
    await this.postEditRequestSerivce.sendRequestChangingPost(
      request,
      user.sub,
    );

    return {
      statusCode: HttpStatus.OK,
      message: PostNotifyMessage.REQUEST_CHANGE_POST_SUCCESSFUL,
    };
  }

  @Post('report')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Report a post',
    description:
      'Report a specific post by its ID with a description of the issue.',
  })
  @ApiBody({ type: ReportPostRequestDto })
  @SwaggerApiResponse({
    status: 200,
    description: 'Report submitted successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Report submitted successfully',
      },
    },
  })
  @SwaggerApiResponse({ status: 404, description: 'Post not found' })
  @SwaggerApiResponse({
    status: 400,
    description: 'You have already reported this post',
  })
  async postReport(
    @Body() request: ReportPostRequestDto,
    @GetUser() user: JwtPayload,
  ): Promise<ApiResponse<PostReportResponseDto>> {
    // 1. Get request from client
    this.logger.verbose('Get request from client');
    this.utilityService.logPretty('Get request from client', request);

    // 2. Get user from token
    this.logger.verbose('Get user from token');
    this.utilityService.logPretty('Get user from token', user);

    // 3. Call report post in service
    this.logger.verbose('Call report post in service');
    const reportPost: PostReportResponseDto =
      await this.postReportService.reportPost(request, user.sub);
    this.utilityService.logPretty(
      'Call report post in service result',
      reportPost,
    );

    // 4. Create response
    this.logger.verbose('Create response for client');
    const response: ApiResponse<PostReportResponseDto> = {
      statusCode: HttpStatus.OK,
      message: PostNotifyMessage.POST_REPORT_SUCCESSFUL,
      data: reportPost,
    };
    this.utilityService.logPretty('Create response for client', response);

    // 5. Return response to client
    this.logger.verbose('Return response to client');
    return response;
  }

  @Get('post-report')
  @ApiOperation({
    summary: 'Lấy danh sách các báo cáo bài viết',
    description:
      'API này trả về danh sách các báo cáo bài viết với phân trang, chỉ dành cho người dùng đã xác thực.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang của danh sách báo cáo bài viết',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng báo cáo bài viết tối đa trên mỗi trang',
    type: Number,
    example: 10,
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách báo cáo bài viết thành công',
    type: PostReportResponseDto,
    isArray: true,
    schema: {
      example: {
        statusCode: 200,
        message: PostNotifyMessage.GET_POST_REPORT_SUCCESSFUL,
        data: [
          {
            id: 1,
            postTitle: 'Bài viết mẫu',
            userName: 'user123',
            status: 'PENDING',
            description: 'Phát hiện nội dung không phù hợp',
            createdAt: '2025-06-10T09:57:00.000Z',
          },
        ],
      },
    },
  })
  @SwaggerApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Không có quyền truy cập (JWT không hợp lệ hoặc thiếu)',
  })
  @SwaggerApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      'Không tìm thấy bài viết hoặc người dùng liên quan đến báo cáo',
  })
  @SwaggerApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Có lỗi xảy ra trên máy chủ',
  })
  async getAllPostsReported(
    @Query() { limit, page }: GetAllPostReportsRequestDto,
    @GetUser() user: JwtPayload,
  ): Promise<ApiResponse<PostReportResponseDto[]>> {
    const postReports: PostReportResponseDto[] =
      await this.postReportService.getAllPostsReported(limit, page, user.sub);
    this.logger.debug(`Post Reports: ${JSON.stringify(postReports)}`);

    return {
      statusCode: HttpStatus.OK,
      message: PostNotifyMessage.GET_POST_REPORT_SUCCESSFUL,
      data: postReports,
    };
  }
}
