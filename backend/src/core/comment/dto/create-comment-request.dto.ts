import { CommentErrorMessage } from '@comment/messages/comment.error-messages';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentRequestDto {
  @ApiProperty({
    example: 1,
    description: 'ID của bài viết cần bình luận',
  })
  @IsInt({ message: CommentErrorMessage.POST_ID_MUST_BE_INTEGER })
  @Min(1, { message: CommentErrorMessage.POST_ID_MUST_BE_POSITIVE })
  postID: number;

  @ApiProperty({
    example: 'Bài viết rất hay!',
    description: 'Nội dung bình luận',
  })
  @IsString({ message: CommentErrorMessage.CONTENT_MUST_BE_STRING })
  @IsNotEmpty({ message: CommentErrorMessage.CONTENT_IS_REQUIRED })
  content: string;
}
