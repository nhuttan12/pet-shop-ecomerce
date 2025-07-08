import { CommentErrorMessage } from '@comment/messages/comment.error-messages';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsString, IsNotEmpty } from 'class-validator';

export class ReplyCommentRequestDto {
  @ApiProperty({
    example: 1,
    description: 'ID của bài viết chứa bình luận cần trả lời',
  })
  @IsInt({ message: CommentErrorMessage.POST_ID_MUST_BE_INTEGER })
  @Min(1, { message: CommentErrorMessage.POST_ID_MUST_BE_POSITIVE })
  postId: number;

  @ApiProperty({
    example: 10,
    description: 'ID của bình luận cha cần trả lời',
  })
  @IsInt({ message: CommentErrorMessage.PARENT_COMMENT_ID_MUST_BE_INTEGER })
  @Min(1, { message: CommentErrorMessage.PARENT_COMMENT_ID_MUST_BE_POSITIVE })
  parentCommentId: number;

  @ApiProperty({
    example: 'Tôi đồng ý với ý kiến này!',
    description: 'Nội dung trả lời bình luận',
  })
  @IsString({ message: CommentErrorMessage.CONTENT_MUST_BE_STRING })
  @IsNotEmpty({ message: CommentErrorMessage.CONTENT_IS_REQUIRED })
  content: string;
}
