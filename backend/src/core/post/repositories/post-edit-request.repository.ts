import { ErrorMessage } from '@messages/error.messages';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SendRequestChangingPostDto } from '@post/dto/send-request-edit.post.dto';
import { PostEditRequest } from '@post/entities/post-edit-request.entity';
import { PostEditRequestStatus } from '@post/enums/post-edit-request-status.enum';
import { PostMessageLog } from '@post/messages/post.messages-log';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PostEditRequestRepository {
  private readonly logger = new Logger(PostEditRequestRepository.name);
  constructor(
    @InjectRepository(PostEditRequest)
    private readonly postEditRequestRepo: Repository<PostEditRequest>,
    private readonly dataSource: DataSource,
  ) {}

  async createPostEditRequest(
    request: SendRequestChangingPostDto,
    employeeID: number,
  ): Promise<PostEditRequest> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const postEditRequest: PostEditRequest = manager.create(
          PostEditRequest,
          {
            post: { id: request.postID },
            employee: { id: employeeID },
            status: PostEditRequestStatus.PENDING,
            reason: request.reason,
            contentSuggested: request.contentSuggested ?? '',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        );

        const saved = await manager.save(PostEditRequest, postEditRequest);

        if (!saved) {
          this.logger.error(PostMessageLog.CANNOT_CREATE_POST_EDIT_REQUEST);
          throw new InternalServerErrorException(
            ErrorMessage.INTERNAL_SERVER_ERROR,
          );
        }

        return saved;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
