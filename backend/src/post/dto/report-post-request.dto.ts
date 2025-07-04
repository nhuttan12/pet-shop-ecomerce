import { NotUrlValidator } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { PostErrorMessage } from '@post';
import { IsInt, IsNotEmpty, IsString, Min, Validate } from 'class-validator';

export class ReportPostDto {
  @ApiProperty({
    description: 'ID của bài đăng cần báo cáo',
    example: 1,
    minimum: 1,
    type: Number,
  })
  @IsInt({ message: PostErrorMessage.POST_ID_MUST_BE_INTEGER })
  @IsNotEmpty({ message: PostErrorMessage.POST_ID_SHOULD_NOT_BE_EMPTY })
  @Min(1, { message: PostErrorMessage.POST_ID_MUST_BE_POSITIVE_NUMBER })
  postId: number;

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
