import { ErrorMessage } from '@messages/error.messages';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostRequestDto } from '@post/dto/create-post-request.dto';
import { EditPostRequestDto } from '@post/dto/edit-post-request.dto';
import { Post } from '@post/entities/posts.entity';
import { PostStatus } from '@post/enums/posts-status.enum';
import { PostMessageLog } from '@post/messages/post.messages-log';
import { DataSource, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class PostRepository {
  private readonly logger = new Logger(PostRepository.name);
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    private readonly dataSource: DataSource,
  ) {}

  async getAllPosts(
    skip: number,
    take: number,
    userID?: number,
  ): Promise<Post[]> {
    try {
      const query = this.postRepo
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.author', 'author');

      if (userID) {
        query.where('author.id = :userId', { userID });
      }

      return query.skip(skip).take(take).getMany();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  // async getAllPostsOfUser(
  //   userID: number,
  //   skip: number,
  //   take: number,
  // ): Promise<Post[]> {
  //   try {
  //     return await this.postRepo.find({
  //       where: { author: { id: userID } },
  //       skip,
  //       take,
  //     });
  //   } catch (error) {
  //     this.logger.error(error);
  //     throw error;
  //   }
  // }

  async getPostById(postID: number): Promise<Post | null> {
    try {
      return await this.postRepo.findOneBy({ id: postID });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getPostByIdsWithAuthor(postIDs: number[]): Promise<Post[]> {
    try {
      if (!postIDs.length) return [];

      return await this.postRepo
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.author', 'author')
        .where('post.id IN (:...postIDs)', { postIDs })
        .getMany();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createPost(
    authorId: number,
    request: CreatePostRequestDto,
  ): Promise<Post> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const post = this.postRepo.create({
          ...request,
          author: { id: authorId },
        });
        return await manager.save(post);
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      this.logger.log(`Create post successfully by author id: ${authorId}`);
    }
  }

  async removePost(postID: number): Promise<boolean> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const result: UpdateResult = await manager.update(
          Post,
          { id: postID },
          { status: PostStatus.REMOVED },
        );

        if (result.affected !== 1) {
          this.logger.error(PostMessageLog.CANNOT_UPDATE_POST);
          throw new InternalServerErrorException(
            ErrorMessage.INTERNAL_SERVER_ERROR,
          );
        }

        return true;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async editPost(dto: EditPostRequestDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const result: UpdateResult = await manager.update(Post, dto.postID, {
          ...dto,
          updatedAt: new Date(),
        });

        if (result.affected !== 1) {
          this.logger.error(PostMessageLog.CANNOT_UPDATE_POST);
          throw new InternalServerErrorException(
            ErrorMessage.INTERNAL_SERVER_ERROR,
          );
        }

        return true;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async setPendingEditRequestToTrue(postID: number): Promise<boolean> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const result: UpdateResult = await manager.update(
          Post,
          { id: postID },
          {
            hasPendingEditRequest: true,
            updatedAt: new Date(),
          },
        );

        if (result.affected !== 1) {
          this.logger.error(PostMessageLog.CANNOT_UPDATE_POST);
          throw new InternalServerErrorException(
            ErrorMessage.INTERNAL_SERVER_ERROR,
          );
        }

        return true;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getPostByIdWithAuthor(postId: number): Promise<Post | null> {
    return this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.id = :postId', { postId })
      .getOne();
  }
}
