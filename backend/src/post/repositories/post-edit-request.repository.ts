import { Injectable, Logger } from '@nestjs/common';
import { PostEditRequest, SendRequestChangingPostDto } from '@post';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PostEditRequestRepository {
  private readonly logger = new Logger(PostEditRequestRepository.name);
  constructor(
    private readonly postEditRequestRepo: Repository<PostEditRequest>,
    private readonly dataSource: DataSource,
  ) {}

  async createPostEditRequest(
    request: SendRequestChangingPostDto, 
  ): Promise<PostEditRequest> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        return await manager.create(PostEditRequest, {
          
        })
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
