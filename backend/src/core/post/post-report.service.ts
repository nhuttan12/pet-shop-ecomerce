import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PostReportResponseDto } from '@post/dto/post-report-response.dto';
import { PostResponse } from '@post/dto/post-response.dto';
import { PostReport } from '@post/entities/post-report.entity';
import { PostErrorMessage } from '@post/messages/post.error-messages';
import { PostMessageLog } from '@post/messages/post.messages-log';
import { PostService } from '@post/post.service';
import { PostReportRepository } from '@post/repositories/post-report.repository';
import { UtilityService } from '@services/utility.service';
import { UserService } from '@user/user.service';
import { plainToInstance } from 'class-transformer';
import { ReportPostRequestDto } from '@post/dto/report-post-request.dto';
import { User } from '@user/entites/users.entity';
import { Post } from '@post/entities/posts.entity';
import { UserErrorMessage } from '@user/messages/user.error-messages';
import { UserMessageLog } from '@user/messages/user.messages-log';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ErrorMessage } from '@messages/error.messages';

@Injectable()
export class PostReportService {
  private readonly logger = new Logger(PostReportService.name);

  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly postReportRepo: PostReportRepository,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
    private readonly utilityService: UtilityService,
    private readonly userService: UserService,
  ) {}

  async reportPost(
    request: ReportPostRequestDto,
    userID: number,
  ): Promise<PostReportResponseDto> {
    // 1. Get post by post ID
    this.logger.verbose('Get post by post ID');
    const post: Post = await this.postService.getPostByPostID(request.postID);
    this.utilityService.logPretty('Get post by post ID', post);

    // 2. Check post exist
    this.logger.verbose('Check post exist');
    if (!post) {
      this.logger.warn(PostMessageLog.POST_NOT_FOUND);
      throw new NotFoundException(PostErrorMessage.POST_NOT_FOUND);
    }

    // 3. Get user by ID
    this.logger.verbose('Get user by ID');
    const user: User = await this.userService.getUserById(userID);
    this.utilityService.logPretty('Get user by ID', user);

    // 4. Check user exist
    this.logger.verbose('Check user exist');
    if (!user) {
      this.logger.warn(UserMessageLog.USER_NOT_FOUND);
      throw new NotFoundException(UserErrorMessage.USER_NOT_FOUND);
    }

    // 5. Get report by post ID and user ID
    this.logger.verbose('Get report by post ID and user ID');
    const existingReport: PostReport | null =
      await this.getPostReportsWithUserIDAndPostID(userID, request.postID);
    this.utilityService.logPretty(
      'Get report by post ID and user ID',
      existingReport,
    );

    // 6. Check report exist
    this.logger.verbose('Check report exist');
    if (existingReport) {
      this.logger.log(PostMessageLog.USER_ALREADY_REPORTED_POST);
      throw new BadRequestException(PostErrorMessage.POST_ALREADY_REPORTED);
    }

    // 7. Create report
    this.logger.verbose('Create report');
    const postReport: PostReport = await this.postReportRepo.createPostReport(
      request.postID,
      userID,
      request.description,
    );
    this.utilityService.logPretty('Create report result', postReport);

    // 8. Check report created
    this.logger.verbose('Check report created');
    if (!postReport) {
      this.logger.warn(PostMessageLog.POST_REPORT_NOT_CREATED);
      throw new NotFoundException(PostErrorMessage.POST_NOT_FOUND);
    }

    // 9. Get post report after created
    this.logger.verbose('Get post report after created');
    const postReportAfterCreated: PostReport | null =
      await this.getPostReportsWithUserIDAndPostID(
        postReport.user.id,
        postReport.post.id,
      );
    this.utilityService.logPretty(
      'Get post report after created',
      postReportAfterCreated,
    );

    // 10. Check post report created
    this.logger.verbose('Check post report created');
    if (!postReportAfterCreated) {
      this.logger.warn(PostMessageLog.POST_REPORT_NOT_CREATED);
      throw new NotFoundException(ErrorMessage.INTERNAL_SERVER_ERROR);
    }

    // 11. Mapping post report to post report response dto
    this.logger.verbose('Mapping post report to post report response dto');
    const postReportResponseDto: PostReportResponseDto = this.mapper.map(
      postReportAfterCreated,
      PostReport,
      PostReportResponseDto,
    );
    this.utilityService.logPretty('Mapping result', postReportResponseDto);

    // 10. Return post report response dto
    this.logger.verbose('Return post report response dto');
    return postReportResponseDto;
  }

  async getPostReportsWithUserIDAndPostID(
    userID: number,
    postID: number,
  ): Promise<PostReport | null> {
    try {
      // 1. Get param from request
      this.logger.debug(
        'Get param from request',
        'userID',
        userID,
        'postID',
        postID,
      );

      // 2. Get report by post ID and user ID
      this.logger.verbose('Get report by post ID and user ID');
      const postReport: PostReport | null =
        await this.postReportRepo.getPostReportsWithUserIDAndPostID(
          userID,
          postID,
        );
      this.utilityService.logPretty(
        'Get report by post ID and user ID',
        postReport,
      );

      // 4. Return report
      this.logger.verbose('Return report');
      return postReport;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllPostsReported(
    limit: number,
    offset: number,
    userID?: number,
  ): Promise<PostReportResponseDto[]> {
    const { skip, take } = this.utilityService.getPagination(offset, limit);

    const postReportList: PostReport[] = !userID
      ? await this.postReportRepo.getAllPostReports(skip, take)
      : await this.postReportRepo.getAllPostReportsForUser(userID, skip, take);

    if (postReportList.length === 0) {
      return [];
    }

    const postReportIDList: number[] = postReportList.map(
      (postReport: PostReport) => postReport.post.id,
    );

    const postList: PostResponse[] =
      await this.postService.findPostByIdsWithAuthor(postReportIDList);

    const postMap = new Map<number, PostResponse>();
    postList.forEach((post) => postMap.set(post.id, post));

    const merged = postReportList.map((postReport) => {
      const post = postMap.get(postReport.post.id);

      if (!post) {
        this.logger.warn(PostMessageLog.POST_NOT_FOUND);
        throw new NotFoundException(PostErrorMessage.POST_NOT_FOUND);
      }

      return {
        id: postReport.id,
        postTitle: post.title,
        username: post.authorName,
        status: postReport.status,
        description: postReport.description,
        createAt: postReport.createdAt,
      };
    });

    const response = plainToInstance(PostReportResponseDto, merged, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    return response;
  }
}
