import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { PostErrorMessage } from 'src/helper/message/post_message';

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

  @ApiProperty({ example: 1, description: 'ID của tác giả' })
  @IsInt({ message: PostErrorMessage.USER_ID_MUST_BE_INTEGER })
  authorId: number;
}
