import { UtilityService } from '@common';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  PostErrorMessage,
  PostMessageLog,
  PostReport,
  PostReportRepository,
  PostReportResponseDto,
  PostRepository,
  PostResponse,
  PostService,
} from '@post';
import { UserService } from '@user';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PostReportService {
  private readonly logger = new Logger(PostReportService.name);
  constructor(
    private readonly postRepo: PostRepository,
    private readonly postReportRepo: PostReportRepository,
    private readonly postService: PostService,
    private readonly utilityService: UtilityService,
    private readonly userService: UserService,
  ) {}

  async reportPost(
    postID: number,
    description: string,
    userID: number,
  ): Promise<boolean> {
    await this.postService.getPostById(postID);

    await this.userService.getUserById(userID);

    const existingReport: PostReport | null =
      await this.postReportRepo.getPostReportsWithUserId(userID, postID);

    if (existingReport) {
      this.logger.log(PostMessageLog.USER_ALREADY_REPORTED_POST);
      throw new BadRequestException(PostErrorMessage.POST_ALREADY_REPORTED);
    }

    const result = await this.postReportRepo.createPostReport(
      postID,
      userID,
      description,
    );

    if (!result) {
      this.logger.warn(PostMessageLog.POST_REPORT_NOT_CREATED);
      throw new NotFoundException(PostErrorMessage.POST_NOT_FOUND);
    }

    return true;
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
