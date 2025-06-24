import { UserService } from '@user/user.service';
import { CreatePostRequestDto } from '@post/dto/create-post-request.dto';
import { EditPostRequestDto } from '@post/dto/edit-post-request.dto';
import { PostReportResponseDto } from '@post/dto/post-report-response.dto';
import { PostResponse } from '@post/dto/post-response.dto';
import { PostEditRequestStatus } from '@post/enums/post-edit-request-status.enum';
import { PostStatus } from '@post/enums/posts-status.enum';
import { DrizzleAsyncProvider } from '@database/drizzle.provider';
import { SearchService } from '@services/search.service';
import { UtilityService } from '@services/utility.service';
import { NotifyMessage } from '@messages/notify.messages';
import { PostErrorMessage, PostMessageLog } from '@message/post-message';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { postEditRequests, postReports, posts, users } from '@schema';
import { Post, PostInsert, PostReport, User } from '@schema-type';
import { and, eq, inArray } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    @Inject(DrizzleAsyncProvider) private db: MySql2Database<any>,
    private searchService: SearchService,
    private userService: UserService,
    private utilityService: UtilityService,
  ) {}

  async getAllPosts(
    limit: number,
    offset: number,
    userId?: number,
  ): Promise<PostResponse[]> {
    try {
      // 1. Get pagination
      const { skip, take } = this.utilityService.getPagination(offset, limit);

      // 2. Check condition to get post each user or all user
      const condition =
        userId !== undefined
          ? and(eq(posts.status, PostStatus.ACTIVE), eq(posts.authorId, userId))
          : undefined;

      // 3. Get post
      const postList: Post[] =
        await this.searchService.findManyOrReturnEmptyArray(
          this.db,
          posts,
          condition,
          userId !== undefined ? take : undefined,
          userId !== undefined ? skip : undefined,
        );

      // 4. Get author id of each post
      const postAuthorIdList: number[] = postList.map((p) => p.authorId);

      // 5. Get author from author id list
      const userList: User[] = await this.db
        .select()
        .from(users)
        .where(inArray(users.id, postAuthorIdList));

      // 6. Map post and author
      const result: PostResponse[] = postList.map((p) => {
        const author: User | undefined = userList.find(
          (u) => u.id === p.authorId,
        );

        return {
          id: p.id,
          title: p.title,
          authorId: p.authorId,
          authorName: author?.name ?? '',
          content: p.content,
          status: p.status,
          hasPendingEditRequest: p.hasPendingEditRequest,
          created_at: p.created_at,
          updated_at: p.updated_at,
        };
      });

      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getPostById(postId: number): Promise<PostResponse> {
    try {
      return this.searchService.findOneOrThrow(
        this.db,
        posts,
        eq(posts.id, postId),
        PostErrorMessage.POST_NOT_FOUND,
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      this.logger.log(`Get post by id: ${postId}`);
    }
  }

  async createPost(
    authorId: number,
    { content, title }: CreatePostRequestDto,
  ): Promise<PostResponse> {
    try {
      const user: User = await this.searchService.findOneOrThrow<User>(
        this.db,
        users,
        eq(users.id, authorId),
        PostErrorMessage.USER_NOT_FOUND,
      );

      const [createdId] = await this.db.transaction(async (tx) => {
        return await tx
          .insert(posts)
          .values({
            title,
            content,
            authorId: user.id,
            status: PostStatus.ACTIVE,
            created_at: new Date(),
            updated_at: new Date(),
          })
          .$returningId();
      });

      return await this.searchService.findOneOrThrow(
        this.db,
        posts,
        eq(posts.id, createdId.id),
        PostErrorMessage.POST_NOT_FOUND,
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      this.logger.log(`Create post successfully by author id: ${authorId}`);
    }
  }

  async removePost(postId: number): Promise<PostResponse> {
    try {
      const post: PostResponse = await this.searchService.findOneOrThrow(
        this.db,
        posts,
        and(eq(posts.id, postId), eq(posts.status, PostStatus.ACTIVE)),
        PostErrorMessage.POST_NOT_FOUND,
      );

      const result = await this.db.transaction(async (tx) => {
        return await tx
          .update(posts)
          .set({ status: PostStatus.REMOVED, updated_at: new Date() })
          .where(eq(posts.id, post.id));
      });

      if (!result) {
        this.logger.error(PostErrorMessage.POST_NOT_FOUND);
        throw new ConflictException(PostErrorMessage.POST_NOT_FOUND);
      }

      return post;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async editPost(
    postId: number,
    authorId: number,
    dto: EditPostRequestDto,
  ): Promise<PostResponse> {
    const post: PostResponse = await this.getPostById(postId);
    if (post.authorId !== authorId) {
      this.logger.error(PostErrorMessage.POST_NOT_FOUND);
      throw new ForbiddenException(PostErrorMessage.POST_NOT_FOUND);
    }

    const updateData: Partial<PostInsert> = {
      ...dto,
      updated_at: new Date(),
    };

    const result = await this.db.transaction(async (tx) => {
      const post: Post = await this.searchService.findOneOrThrow(
        this.db,
        posts,
        eq(posts.id, postId),
      );

      if (post.hasPendingEditRequest) {
        updateData.hasPendingEditRequest = false;
      }

      return await tx.update(posts).set(updateData).where(eq(posts.id, postId));
    });

    if (!result) {
      this.logger.error(PostErrorMessage.CANNOT_UPDATE_POST);
      throw new ConflictException(PostMessageLog.CANNOT_UPDATE_POST);
    }

    return await this.searchService.findOneOrThrow(
      this.db,
      posts,
      eq(posts.id, postId),
      PostErrorMessage.POST_NOT_FOUND,
    );
  }

  async sendRequestChangingPost(
    postId: number,
    reason: string,
    contentSuggested?: string,
  ): Promise<void> {
    try {
      const post: PostResponse = await this.searchService.findOneOrThrow(
        this.db,
        posts,
        eq(posts.id, postId),
        PostErrorMessage.POST_NOT_FOUND,
      );

      const result = await this.db.transaction(async (tx) => {
        const update = await tx
          .update(posts)
          .set({ hasPendingEditRequest: true })
          .where(eq(posts.id, post.id));

        const postEditRequest = await tx
          .insert(postEditRequests)
          .values({
            postId: post.id,
            employeeId: post.authorId,
            status: PostEditRequestStatus.PENDING,
            reason: reason,
            contentSuggested: contentSuggested ?? '',
            created_at: new Date(),
            updated_at: new Date(),
          })
          .$returningId();

        return { update, postEditRequest };
      });

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
