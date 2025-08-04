import { CommentErrorMessage } from '@comment/messages/comment.error-messages';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsString, IsNotEmpty } from 'class-validator';

export class UpdateCommentRequestDto {
  @ApiProperty({
    example: 1,
    description: 'ID của bình luận cần cập nhật',
  })
  @IsInt({ message: CommentErrorMessage.COMMENT_ID_MUST_BE_INTEGER })
  @Min(1, { message: CommentErrorMessage.COMMENT_ID_MUST_BE_POSITIVE })
  commentID: number;

  @ApiProperty({
    example: 'Cập nhật nội dung bình luận',
    description: 'Nội dung mới của bình luận',
  })
  @IsString({ message: CommentErrorMessage.CONTENT_MUST_BE_STRING })
  @IsNotEmpty({ message: CommentErrorMessage.CONTENT_IS_REQUIRED })
  content: string;
}
