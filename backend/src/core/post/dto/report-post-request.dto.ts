import { NotUrlValidator } from '@class-validator/not-url.validator';
import { ApiProperty } from '@nestjs/swagger';
import { PostErrorMessage } from '@post/messages/post.error-messages';
import { IsInt, IsNotEmpty, Min, IsString, Validate } from 'class-validator';

export class ReportPostRequestDto {
  @ApiProperty({
    description: 'ID của bài đăng cần báo cáo',
    example: 1,
    minimum: 1,
    type: Number,
  })
  @IsNotEmpty({ message: PostErrorMessage.POST_ID_SHOULD_NOT_BE_EMPTY })
  @IsInt({ message: PostErrorMessage.POST_ID_MUST_BE_INTEGER })
  @Min(1, { message: PostErrorMessage.POST_ID_MUST_BE_POSITIVE_NUMBER })
  postID: number;

  @ApiProperty({
    description: 'Lý do báo cáo bài đăng',
    example: 'Nội dung không phù hợp',
    type: String,
  })
  @IsString({ message: PostErrorMessage.POST_DESCRIPTION_MUST_BE_A_STRING })
  @IsNotEmpty({
    message: PostErrorMessage.POST_DESCRIPTION_SHOULD_NOT_BE_EMPTY,
  })
  @Validate(NotUrlValidator)
  description: string;
}
