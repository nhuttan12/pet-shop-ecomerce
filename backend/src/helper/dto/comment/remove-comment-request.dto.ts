import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommentErrorMessage } from '@message/comment-message';

export class RemoveCommentRequestDto {
  @ApiProperty({
    example: 1,
    description: 'ID của bình luận cần xoá',
  })
  @IsInt({ message: CommentErrorMessage.COMMENT_ID_MUST_BE_INTEGER })
  @Min(1, { message: CommentErrorMessage.COMMENT_ID_MUST_BE_POSITIVE })
  commentId: number;

  @ApiProperty({
    example: 1,
    description: 'ID của bài viết chứa bình luận',
  })
  @IsInt({ message: CommentErrorMessage.POST_ID_MUST_BE_INTEGER })
  @Min(1, { message: CommentErrorMessage.POST_ID_MUST_BE_POSITIVE })
  postId: number;
}
