import { Comment } from '@comment/entities/comments.entity';
import { CommentStatus } from '@comment/enums/comment-status.enum';
import { CommentErrorMessage } from '@comment/messages/comment.error-messages';
import { CommentMessageLog } from '@comment/messages/comment.messages-log';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CommentRepository {
  private readonly logger = new Logger(CommentRepository.name);
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly dataSource: DataSource,
  ) {}

  async createComment(
    postID: number,
    userID: number,
    content: string,
  ): Promise<Comment> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const comment = manager.create(Comment, {
          post: { id: postID },
          user: { id: userID },
          content,
          createdAt: new Date(),
        });

        return await manager.save(comment);
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async removeComment(commentID: number): Promise<boolean> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const result: UpdateResult = await manager
          .createQueryBuilder()
          .update(Comment)
          .set({ status: CommentStatus.REMOVED, updatedAt: new Date() })
          .where('id = :commentID', {
            commentID,
          })
          .returning('*')
          .execute();

        if (result.affected !== 1) {
          this.logger.error(CommentMessageLog.CANNOT_DELETE_COMMENT);
          throw new InternalServerErrorException(
            CommentErrorMessage.CANNOT_DELETE_COMMENT,
          );
        }

        return result.affected === 1;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getCommentByFilter(filter: {
    commentID?: number;
    postID?: number;
    userID?: number;
  }): Promise<Comment | null> {
    try {
      const query = this.commentRepo
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.post', 'post')
        .leftJoinAndSelect('comment.user', 'user');

      if (filter.commentID !== undefined) {
        query.andWhere('comment.id = :commentID', {
          commentID: filter.commentID,
        });
      }

      if (filter.postID !== undefined) {
        query.andWhere('comment.postId = :postID', { postID: filter.postID });
      }

      if (filter.userID !== undefined) {
        query.andWhere('comment.userId = :userID', { userID: filter.userID });
      }

      return await query.getOne();
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      this.logger.log('Get comments by filter', filter);
    }
  }

  async updateComment(commentID: number, content: string): Promise<boolean> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const result: UpdateResult = await manager.update(
          Comment,
          {
            id: commentID,
          },
          {
            content,
            updatedAt: new Date(),
          },
        );

        if (result.affected !== 1) {
          this.logger.error(CommentMessageLog.CANNOT_UPDATE_COMMENT);
          throw new InternalServerErrorException(
            CommentErrorMessage.CANNOT_UPDATE_COMMENT,
          );
        }

        return result.affected === 1;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async replyComment(
    postID: number,
    userID: number,
    parentCommentID: number,
    content: string,
  ): Promise<Comment> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const comment = manager.create(Comment, {
          post: { id: postID },
          user: { id: userID },
          comment: { id: parentCommentID },
          content,
          createdAt: new Date(),
        });

        return await manager.save(comment);
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      this.logger.log('Reply comment successfully');
    }
  }

  async getCommentByPostIDPaging(
    postID: number,
    skip: number,
    take: number,
  ): Promise<Comment[]> {
    try {
      return await this.commentRepo.find({
        where: {
          post: {
            id: postID,
          },
          status: CommentStatus.ACTIVE,
        },
        skip,
        take,
        order: {
          createdAt: 'DESC',
        },
        relations: {
          user: true,
          post: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
