import { ErrorMessage } from '@common';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PostMessageLog, PostReport, PostReportStatus } from '@post';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PostReportRepository {
  private readonly logger = new Logger(PostReportRepository.name);
  constructor(
    private readonly postReportRepo: Repository<PostReport>,
    private readonly dataSource: DataSource,
  ) {}

  async getPostReportsWithUserId(
    userID: number,
    postID: number,
  ): Promise<PostReport | null> {
    try {
      return await this.postReportRepo.findOne({
        where: {
          user: { id: userID },
          post: { id: postID },
          status: PostReportStatus.PENDING,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createPostReport(
    postID: number,
    userID: number,
    description: string,
  ): Promise<PostReport> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const postReport: PostReport = manager.create(PostReport, {
          post: { id: postID },
          user: { id: userID },
          description,
          status: PostReportStatus.PENDING,
          createdAt: new Date(),
        });

        const result = await manager.save(PostReport, postReport);

        if (!result) {
          this.logger.error(PostMessageLog.POST_REPORT_NOT_CREATED);
          throw new InternalServerErrorException(
            ErrorMessage.INTERNAL_SERVER_ERROR,
          );
        }

        return result;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllPostReports(skip: number, take: number): Promise<PostReport[]> {
    try {
      return await this.postReportRepo
        .createQueryBuilder('postReport')
        .leftJoinAndSelect('postReport.post', 'post')
        .leftJoinAndSelect('postReport.user', 'user')
        .skip(skip)
        .take(take)
        .getMany();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllPostReportsForUser(
    userID: number,
    skip: number,
    take: number,
  ): Promise<PostReport[]> {
    try {
      return await this.postReportRepo
        .createQueryBuilder('postReport')
        .leftJoinAndSelect('postReport.post', 'post')
        .leftJoinAndSelect('postReport.user', 'user')
        .where('postReport.user.id = :userID', { userID })
        .skip(skip)
        .take(take)
        .getMany();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
