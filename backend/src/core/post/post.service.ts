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
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UserErrorMessage } from '@user/messages/user.error-messages';
import { RoleName } from '@role/enums/role.enum';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private userService: UserService,
    private utilityService: UtilityService,
    private readonly postRepo: PostRepository,
  ) {}

  async getAllPosts(request: GetAllPostsRequestDto): Promise<PostResponse[]> {
    try {
      // 1. Get pagination
      this.logger.verbose('Get pagination');
      const { skip, take } = this.utilityService.getPagination(
        request.page,
        request.limit,
      );
      this.logger.debug('Skip: ', skip, 'Take: ', take);

      // 2. Get all posts for customer
      this.logger.verbose('Get all posts for user with customer role');
      const postList: Post[] = await this.postRepo.getAllPosts(skip, take);
      this.utilityService.logPretty('Get all posts: ', postList);

      // 3. Mapping to post response
      this.logger.verbose('Mapping to post response');
      const postResponseList: PostResponse[] = this.mapper.mapArray(
        postList,
        Post,
        PostResponse,
      );
      this.utilityService.logPretty('Post response list: ', postResponseList);

      // 4. Return post response list
      this.logger.verbose('Return post response list');
      return postResponseList;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getPostByIdWithAuthor(postId: number): Promise<PostResponse> {
    try {
      // 1. Get post by ID with author
      this.logger.verbose('Get post by ID with author');
      const post: Post | null =
        await this.postRepo.getPostByIdWithAuthor(postId);
      this.utilityService.logPretty('Get post by ID with author', post);

      // 2. Check post exist
      this.logger.verbose('Check post exist');
      if (!post) {
        this.logger.warn(PostMessageLog.POST_NOT_FOUND);
        throw new NotFoundException(PostErrorMessage.POST_NOT_FOUND);
      }

      // 3. Mapping to post response
      this.logger.verbose('Mapping to post response');
      const postResponse: PostResponse = this.mapper.map(
        post,
        Post,
        PostResponse,
      );
      this.utilityService.logPretty('Post response: ', postResponse);

      // 4. Return post response
      this.logger.verbose('Return post response');
      return postResponse;
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

  async removePost(postID: number, userID: number): Promise<PostResponse> {
    try {
      // 1. Get param from request
      this.logger.verbose(
        'Get param from request, post ID',
        postID,
        'user ID',
        userID,
      );

      // 2. Get post from repo
      this.logger.verbose('Get post from repo');
      const post: Post | null = await this.postRepo.getPostByPostID(postID);
      this.utilityService.logPretty('Get post: ', post);

      // 3. Check post exist
      this.logger.verbose('Check post exist');
      if (!post) {
        this.logger.warn(PostMessageLog.POST_NOT_FOUND);
        throw new NotFoundException(PostErrorMessage.POST_NOT_FOUND);
      }

      // 4. Get user by ID from user service
      this.logger.verbose('Get user by ID from user service');
      const user: User | null = await this.userService.getUserById(userID);
      this.utilityService.logPretty('Get user: ', user);

      // 5. Check user exist
      this.logger.verbose('Check user exist');
      if (!user) {
        this.logger.warn(UserErrorMessage.USER_NOT_FOUND);
        throw new NotFoundException(UserErrorMessage.USER_NOT_FOUND);
      }

      // 6. Check user is admin or author
      this.logger.verbose('Check user is admin or author');
      if (
        post.author.id !== userID &&
        user.role.name !== (RoleName.ADMIN as string)
      ) {
        // 7. Throw error
        this.logger.warn(
          PostMessageLog.SOMEONE_IS_NOT_EMPLOYEE_OR_AUTHOR_REMOVE_POST,
        );
        throw new ForbiddenException(
          PostErrorMessage.YOU_DONT_HAVE_PERMISSION_TO_DELETE_THIS_POST,
        );
      }

      // 8. Remove post
      this.logger.verbose('Remove post');
      const result: boolean = await this.postRepo.removePost(postID);
      this.utilityService.logPretty('Remove post result: ', result);

      // 9. Check result
      this.logger.verbose('Check result');
      if (!result) {
        this.logger.warn(PostMessageLog.CANNOT_UPDATE_POST);
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
      }

      // 10. Get post after remove
      this.logger.verbose('Get post after remove');
      const postAfterRemove: PostResponse =
        await this.getPostByIdWithAuthor(postID);
      this.utilityService.logPretty('Get post after remove: ', postAfterRemove);

      // 11. Return post
      this.logger.verbose('Return post');
      return postAfterRemove;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async editPost(
    userID: number,
    dto: EditPostRequestDto,
  ): Promise<PostResponse> {
    // 0. Get param from request
    this.logger.verbose('Get param from request, user ID', userID);
    this.utilityService.logPretty('Get param from request', dto);

    // 1. Get post from post service
    this.logger.verbose('Get post from post service');
    const post: PostResponse = await this.getPostByIdWithAuthor(dto.postID);
    this.utilityService.logPretty('Update post: ', post);

    // 2. Get user by ID from user service
    this.logger.verbose('Get user by ID from user service');
    const user: User | null = await this.userService.getUserById(userID);
    this.utilityService.logPretty('Get user: ', user);

    // 3. Check user exist
    this.logger.verbose('Check user exist');
    if (!user) {
      this.logger.warn(UserErrorMessage.USER_NOT_FOUND);
      throw new NotFoundException(UserErrorMessage.USER_NOT_FOUND);
    }

    // 4. Check user is author
    this.logger.verbose('Check user is author');
    if (post.authorID !== userID) {
      // 5. Throw error
      this.logger.warn(PostMessageLog.SOMEONE_IS_NOT_AUTHOR_EDIT_POST);
      throw new ForbiddenException(
        PostErrorMessage.YOU_DONT_HAVE_PERMISSION_TO_UPDATE_THIS_POST,
      );
    }

    // 6. Update post
    this.logger.verbose('Update post');
    const result: boolean = await this.postRepo.editPost(dto);
    this.utilityService.logPretty('Update post result: ', result);

    // 7. Check update post result
    this.logger.verbose('Check update post result');
    if (!result) {
      this.logger.warn(PostErrorMessage.CANNOT_UPDATE_POST);
      throw new ConflictException(PostMessageLog.CANNOT_UPDATE_POST);
    }

    // 8. Get post after update
    this.logger.verbose('Get post after update');
    const postAfterUpdate: PostResponse = await this.getPostByIdWithAuthor(
      dto.postID,
    );
    this.utilityService.logPretty('Get post after update: ', postAfterUpdate);

    // 9. Return post after update
    this.logger.verbose('Return post after update');
    return postAfterUpdate;
  }

  async getPostByPostID(postID: number): Promise<Post> {
    try {
      // 1. Get post from repository
      this.logger.verbose('Get post from repository');
      const post = await this.postRepo.getPostByPostID(postID);
      this.utilityService.logPretty('Get post from repository', post);

      // 2. Check post exist
      this.logger.verbose('Check post exist');
      if (!post) {
        this.logger.warn(PostMessageLog.POST_NOT_FOUND);
        throw new NotFoundException(PostErrorMessage.POST_NOT_FOUND);
      }

      // 3. Return post
      this.logger.verbose('Return post');
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
