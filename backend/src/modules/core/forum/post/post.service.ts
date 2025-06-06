import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { PostInsert, User } from 'src/db/helper/schema-type';
import { posts, users } from 'src/db/schema';
import { CreatePostRequestDto } from 'src/helper/dto/post/create-post-request.dto';
import { EditPostRequestDto } from 'src/helper/dto/post/edit-post-request.dto';
import { PostResponse } from 'src/helper/dto/post/post-response.dto';
import { PostStatus } from 'src/helper/enum/status/posts-status.enum';
import {
  PostErrorMessage,
  PostMessageLog,
} from 'src/helper/message/post_message';
import { SearchService } from 'src/modules/helper/services/search.service';
import { DrizzleAsyncProvider } from './../../../helper/database/drizzle.provider';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    @Inject(DrizzleAsyncProvider) private db: MySql2Database<any>,
    private searchService: SearchService,
  ) {}

  async getAllPosts(
    limit: number,
    offset: number,
    userId?: number,
  ): Promise<PostResponse[]> {
    try {
      offset = offset <= 0 ? 0 : offset - 1;

      const condition =
        userId !== undefined
          ? and(eq(posts.status, PostStatus.ACTIVE), eq(posts.authorId, userId))
          : eq(posts.status, PostStatus.ACTIVE);

      return this.searchService.findManyOrReturnEmptyArray(
        this.db,
        posts,
        condition,
        limit,
        offset,
      );
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

  async createPost({
    authorId,
    content,
    title,
  }: CreatePostRequestDto): Promise<PostResponse> {
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
    dto: EditPostRequestDto,
  ): Promise<PostResponse> {
    await this.getPostById(postId);

    const updateData: Partial<PostInsert> = {
      ...dto,
      updated_at: new Date(),
    };

    const result = await this.db.transaction(async (tx) => {
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
}
