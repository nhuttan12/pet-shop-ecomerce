import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommentErrorMessage } from '@message/comment-message';

export class UpdateCommentRequestDto {
  @ApiProperty({
    example: 1,
    description: 'ID của bình luận cần cập nhật',
  })
  @IsInt({ message: CommentErrorMessage.COMMENT_ID_MUST_BE_INTEGER })
  @Min(1, { message: CommentErrorMessage.COMMENT_ID_MUST_BE_POSITIVE })
  commentId: number;

  @ApiProperty({
    example: 'Cập nhật nội dung bình luận',
    description: 'Nội dung mới của bình luận',
  })
  @IsString({ message: CommentErrorMessage.CONTENT_MUST_BE_STRING })
  @IsNotEmpty({ message: CommentErrorMessage.CONTENT_IS_REQUIRED })
  content: string;
}
