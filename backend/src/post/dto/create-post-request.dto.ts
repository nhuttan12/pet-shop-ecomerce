import { ApiProperty } from '@nestjs/swagger';
import { PostErrorMessage } from '@post/messages/post.error-messages';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreatePostRequestDto {
  @ApiProperty({ example: 'Tiêu đề bài viết', maxLength: 255 })
  @IsString({ message: PostErrorMessage.POST_TITLE_MUST_BE_A_STRING })
  @IsNotEmpty({ message: PostErrorMessage.POST_TITLE_SHOULD_NOT_BE_EMPTY })
  @MinLength(1, { message: PostErrorMessage.POST_TITLE_SHOULD_NOT_BE_EMPTY })
  title: string;

  @ApiProperty({ example: 'Nội dung bài viết' })
  @IsString({ message: PostErrorMessage.CONTENT_TITLE_MUST_BE_A_STRING })
  @IsNotEmpty({ message: PostErrorMessage.CONTENT_TITLE_SHOULD_NOT_BE_EMPTY })
  content: string;
}
