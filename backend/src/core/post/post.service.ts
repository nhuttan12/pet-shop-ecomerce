import { ErrorMessage } from '@messages/error.messages';
import { UtilityService } from '@services/utility.service';
import { User } from '@user/entites/users.entity';
import { UserService } from '@user/user.service';
import { CreatePostRequestDto } from './dto/create-post-request.dto';
import { EditPostRequestDto } from './dto/edit-post-request.dto';
import { GetAllPostsRequestDto } from './dto/get-all-posts-request.dto';
import { PostResponse } from './dto/post-response.dto';
import { Post } from './entities/posts.entity';
import { PostErrorMessage } from './messages/post.error-messages';
import { PostMessageLog } from './messages/post.messages-log';
import { PostRepository } from './repositories/post.repository';
import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    private userService: UserService,
    private utilityService: UtilityService,
    private readonly postRepo: PostRepository,
  ) {}

  async getAllPosts(
    request: GetAllPostsRequestDto,
    userID?: number,
  ): Promise<PostResponse[]> {
    try {
      // 1. Get pagination
      const { skip, take } = this.utilityService.getPagination(
        request.page,
        request.limit,
      );

      // 2. Check condition to get post each user or all user
      const postList = await this.postRepo.getAllPosts(skip, take, userID);

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
        return {
          ...post,
          authorID: post.author.id,
          authorName: post.author.name,
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

  async getPostByIdWithAuthor(postId: number): Promise<PostResponse> {
    try {
      const post: Post | null =
        await this.postRepo.getPostByIdWithAuthor(postId);

      if (!post) {
        this.logger.error(PostMessageLog.POST_NOT_FOUND);
        throw new NotFoundException(PostErrorMessage.POST_NOT_FOUND);
      }

      const merge = {
        ...post,
        authorID: post.author.id,
        authorName: post.author.name,
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

  async findPostByIdsWithAuthor(postIds: number[]): Promise<PostResponse[]> {
    try {
      const posts: Post[] = await this.postRepo.getPostByIdsWithAuthor(postIds);

      const result: PostResponse[] = posts.map((post) => {
        if (!post.author) {
          this.logger.warn(`Post ${post.id} is missing author`);
          throw new NotFoundException(`Author not found for post ${post.id}`);
        }

        const merged = {
          ...post,
          authorID: post.author.id,
          authorName: post.author.name,
        };

        return plainToInstance(PostResponse, merged, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });

      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
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

      return await this.getPostByIdWithAuthor(postID);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async editPost(
    authorId: number,
    dto: EditPostRequestDto,
  ): Promise<PostResponse> {
    const post: PostResponse = await this.getPostByIdWithAuthor(dto.postID);

    if (post.authorId !== authorId) {
      this.logger.error(PostErrorMessage.POST_NOT_FOUND);
      throw new ForbiddenException(PostErrorMessage.POST_NOT_FOUND);
    }

    const result: boolean = await this.postRepo.editPost(dto);

    if (!result) {
      this.logger.error(PostErrorMessage.CANNOT_UPDATE_POST);
      throw new ConflictException(PostMessageLog.CANNOT_UPDATE_POST);
    }

    return await this.getPostByIdWithAuthor(dto.postID);
  }

  async getPostById(postID: number): Promise<Post> {
    try {
      const post = await this.postRepo.getPostById(postID);

      if (!post) {
        this.logger.warn(PostMessageLog.POST_NOT_FOUND);
        throw new NotFoundException(PostErrorMessage.POST_NOT_FOUND);
      }

      return post;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async setPendingEditRequestToTrue(postID: number): Promise<boolean> {
    try {
      return await this.postRepo.setPendingEditRequestToTrue(postID);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
