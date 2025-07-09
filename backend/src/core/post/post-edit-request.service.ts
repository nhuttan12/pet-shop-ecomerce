import { ErrorMessage } from '@messages/error.messages';
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SendRequestChangingPostDto } from '@post/dto/send-request-edit.post.dto';
import { PostEditRequest } from '@post/entities/post-edit-request.entity';
import { PostErrorMessage } from '@post/messages/post.error-messages';
import { PostMessageLog } from '@post/messages/post.messages-log';
import { PostService } from '@post/post.service';
import { PostEditRequestRepository } from '@post/repositories/post-edit-request.repository';

@Injectable()
export class PostEditRequestService {
  private readonly logger = new Logger(PostEditRequestService.name);
  constructor(
    private readonly postEditRequestRepo: PostEditRequestRepository,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
  ) {}

  async sendRequestChangingPost(
    request: SendRequestChangingPostDto,
    employeeID: number,
  ): Promise<PostEditRequest> {
    try {
      await this.postService.getPostByIdWithAuthor(request.postID);

      const setPendingEditRequestResult: boolean =
        await this.postService.setPendingEditRequestToTrue(request.postID);

      if (!setPendingEditRequestResult) {
        this.logger.warn(PostMessageLog.CANNOT_UPDATE_POST);
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
      }

      const postEditRequests: PostEditRequest =
        await this.postEditRequestRepo.createPostEditRequest(
          request,
          employeeID,
        );

      if (!postEditRequests) {
        this.logger.warn(PostMessageLog.CANNOT_CREATE_POST_EDIT_REQUEST);
        throw new NotFoundException(PostErrorMessage.EDIT_REQUEST_NOT_FOUND);
      }

      return postEditRequests;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
