import { CommentErrorMessage } from '@comment/messages/comment.error-messages';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class RemoveCommentRequestDto {
  @ApiProperty({
    example: 1,
    description: 'ID của bình luận cần xoá',
  })
  @IsInt({ message: CommentErrorMessage.COMMENT_ID_MUST_BE_INTEGER })
  @Min(1, { message: CommentErrorMessage.COMMENT_ID_MUST_BE_POSITIVE })
  commentID: number;

  @ApiProperty({
    example: 1,
    description: 'ID của bài viết chứa bình luận',
  })
  @IsInt({ message: CommentErrorMessage.POST_ID_MUST_BE_INTEGER })
  @Min(1, { message: CommentErrorMessage.POST_ID_MUST_BE_POSITIVE })
  postID: number;
}
