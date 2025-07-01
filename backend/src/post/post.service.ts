import { ErrorMessage, UtilityService, postEditRequests } from '@common';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreatePostRequestDto,
  EditPostRequestDto,
  GetAllPostsRequestDto,
  Post,
  PostEditRequest,
  PostEditRequestRepository,
  PostErrorMessage,
  PostMessageLog,
  PostRepository,
  PostResponse,
  SendRequestChangingPostDto,
} from '@post';
import { User, UserService } from '@user';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    private userService: UserService,
    private utilityService: UtilityService,
    private readonly postRepo: PostRepository,
    private readonly postEditRequestRepo: PostEditRequestRepository,
  ) {}

  async getAllPosts(
    request: GetAllPostsRequestDto,
    userId?: number,
  ): Promise<PostResponse[]> {
    try {
      // 1. Get pagination
      const { skip, take } = this.utilityService.getPagination(
        request.page,
        request.limit,
      );

      // 2. Check condition to get post each user or all user
      const postList = !userId
        ? await this.postRepo.getAllPosts(skip, take)
        : await this.postRepo.getAllPostsOfUser(userId, skip, take);

      if (postList.length === 0) {
        return [];
      }

      // 3. Get author id of each post
      const authorIds: number[] = postList.map((post) => post.author.id);

      // 5. Get author from author id list
      const authorList: User[] =
        await this.userService.findUsersById(authorIds);

      // 6. Map post and author
      const authorMap = new Map<number, User>();

      for (const user of authorList) {
        authorMap.set(user.id, user);
      }

      const mergedPost = postList.map((post) => {
        const author = authorMap.get(post.author.id);
        return {
          ...post,
          authorID: post.author.id,
          authorName: author?.name,
        };
      });

      return plainToInstance(PostResponse, mergedPost, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getPostById(postId: number): Promise<PostResponse> {
    try {
      const post: Post | null = await this.postRepo.getPostById(postId);

      if (!post) {
        this.logger.error(PostMessageLog.POST_NOT_FOUND);
        throw new NotFoundException(PostErrorMessage.POST_NOT_FOUND);
      }

      const author: User = await this.userService.getUserById(post.author.id);

      const merge = {
        ...post,
        authorID: post.author.id,
        authorName: author.name,
      };

      return plainToInstance(PostResponse, merge, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      this.logger.log(`Get post by id: ${postId}`);
    }
  }

  async createPost(
    authorId: number,
    request: CreatePostRequestDto,
  ): Promise<PostResponse> {
    try {
      // 1. Check author exist
      const user: User = await this.userService.getUserById(authorId);

      // 2. Create post
      const post: Post = await this.postRepo.createPost(authorId, request);

      // 3. Mapping
      const merge = {
        ...post,
        authorID: post.author.id,
        authorName: user.name,
      };

      return plainToInstance(PostResponse, merge, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      this.logger.log(`Create post successfully by author id: ${authorId}`);
    }
  }

  async removePost(postID: number): Promise<PostResponse> {
    try {
      const post = await this.postRepo.getPostById(postID);

      if (!post) {
        this.logger.warn(PostMessageLog.POST_NOT_FOUND);
        throw new NotFoundException(PostErrorMessage.POST_NOT_FOUND);
      }

      const result: boolean = await this.postRepo.removePost(postID);

      if (!result) {
        this.logger.warn(PostMessageLog.CANNOT_UPDATE_POST);
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
      }

      return await this.getPostById(postID);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async editPost(
    authorId: number,
    dto: EditPostRequestDto,
  ): Promise<PostResponse> {
    const post: PostResponse = await this.getPostById(dto.postID);

    if (post.authorId !== authorId) {
      this.logger.error(PostErrorMessage.POST_NOT_FOUND);
      throw new ForbiddenException(PostErrorMessage.POST_NOT_FOUND);
    }

    const result: boolean = await this.postRepo.editPost(dto);

    if (!result) {
      this.logger.error(PostErrorMessage.CANNOT_UPDATE_POST);
      throw new ConflictException(PostMessageLog.CANNOT_UPDATE_POST);
    }

    return await this.getPostById(dto.postID);
  }

  async sendRequestChangingPost(
    request: SendRequestChangingPostDto,
  ): Promise<void> {
    try {
      await this.getPostById(request.postID);

      const setPendingEditRequestResult =
        await this.postRepo.setPendingEditRequestToTrue(request.postID);

      if (!setPendingEditRequestResult) {
        this.logger.warn(PostMessageLog.CANNOT_UPDATE_POST);
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
      }

      const postEditRequests: PostEditRequest =
        await this.postEditRequestRepo.createPostEditRequest(request);

      // const result = await this.db.transaction(async (tx) => {
      //   const update = await tx
      //     .update(posts)
      //     .set({ hasPendingEditRequest: true })
      //     .where(eq(posts.id, post.id));

      //   const postEditRequest = await tx
      //     .insert(postEditRequests)
      //     .values({
      //       postId: post.id,
      //       employeeId: post.authorId,
      //       status: PostEditRequestStatus.PENDING,
      //       reason: reason,
      //       contentSuggested: contentSuggested ?? '',
      //       created_at: new Date(),
      //       updated_at: new Date(),
      //     })
      //     .$returningId();

      //   return { update, postEditRequest };
      // });

      if (!result) {
        this.logger.error(PostErrorMessage.POST_NOT_FOUND);
        throw new NotFoundException(PostErrorMessage.POST_NOT_FOUND);
      }

      return await this.searchService.findOneOrThrow(
        this.db,
        postEditRequests,
        eq(postEditRequests.id, result.postEditRequest[0].id),
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async reportPost(
    postId: number,
    description: string,
    userId: number,
  ): Promise<string> {
    const post: PostResponse = await this.getPostById(postId);

    const user: User = await this.userService.getUserById(userId);

    const [existingReport] =
      await this.searchService.findManyOrReturnEmptyArray(
        this.db,
        postReports,
        and(eq(postReports.postId, post.id), eq(postReports.userId, userId)),
      );

    if (existingReport) {
      this.logger.log(PostMessageLog.USER_ALREADY_REPORTED_POST);
      throw new BadRequestException(PostErrorMessage.POST_ALREADY_REPORTED);
    }

    const result = await this.db.transaction(async (tx) => {
      return await tx.insert(postReports).values({
        postId: post.id,
        userId: user.id,
        description,
        createdAt: new Date(),
      });
    });

    if (!result) {
      this.logger.error(PostMessageLog.POST_NOT_FOUND);
      throw new NotFoundException(PostErrorMessage.POST_NOT_FOUND);
    }

    return NotifyMessage.POST_REPORT_SUCCESSFUL;
  }

  async getAllPostsReported(
    limit: number,
    offset: number,
    userId?: number,
  ): Promise<PostReportResponseDto[]> {
    const { skip, take } = this.utilityService.getPagination(offset, limit);

    const condition =
      userId !== undefined ? eq(postReports.userId, userId) : undefined;

    const postReportList: PostReport[] =
      await this.searchService.findManyOrReturnEmptyArray(
        this.db,
        postReports,
        condition,
        take,
        skip,
      );

    const postIdList = postReportList.map(
      (postReport: PostReport) => postReport.postId,
    );

    const postList: PostResponse[] =
      await this.searchService.findManyOrReturnEmptyArray(
        this.db,
        posts,
        inArray(posts.id, postIdList),
      );

    const userIdList = postList.map((post: Post) => post.authorId);

    const userList: User[] = await this.userService.findUserByIds(userIdList);
    this.logger.debug(`User list: ${JSON.stringify(userList)}`);

    const result: PostReportResponseDto[] = postReportList.map(
      (postReport: PostReport) => {
        const post: PostResponse | undefined = postList.find(
          (p: PostResponse) => p.id === postReport.postId,
        );

        if (!post) {
          this.logger.error(PostErrorMessage.POST_NOT_FOUND);
          throw new NotFoundException(PostErrorMessage.POST_NOT_FOUND);
        }

        const user: User | undefined = userList.find(
          (u: User) => u.id === post?.authorId,
        );

        if (!user) {
          this.logger.error(PostErrorMessage.USER_NOT_FOUND);
          throw new NotFoundException(PostErrorMessage.USER_NOT_FOUND);
        }

        return {
          id: postReport.id,
          postTitle: post.title,
          userName: user.username,
          status: postReport.status,
          description: postReport.description,
          createdAt: postReport.createdAt,
        };
      },
    );

    return result;
  }
}
