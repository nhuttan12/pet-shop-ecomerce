import { ErrorMessage } from '@common';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  CreatePostRequestDto,
  EditPostRequestDto,
  Post,
  PostMessageLog,
  PostStatus,
} from '@post';
import { DataSource, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class PostRepository {
  private readonly logger = new Logger(PostRepository.name);
  constructor(
    private readonly postRepo: Repository<Post>,
    private readonly dataSource: DataSource,
  ) {}

  async getAllPosts(skip: number, take: number): Promise<Post[]> {
    try {
      return await this.postRepo.find({ skip, take });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllPostsOfUser(
    userID: number,
    skip: number,
    take: number,
  ): Promise<Post[]> {
    try {
      return await this.postRepo.find({
        where: { author: { id: userID } },
        skip,
        take,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getPostById(postID: number): Promise<Post | null> {
    try {
      return await this.postRepo.findOneBy({ id: postID });
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
}
