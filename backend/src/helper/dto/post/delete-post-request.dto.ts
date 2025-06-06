import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { PostErrorMessage } from 'src/helper/message/post_message';

export class DeletePostRequestDto {
  @IsInt({ message: PostErrorMessage.POST_ID_MUST_BE_POSITIVE_NUMBER })
  @Min(1, { message: PostErrorMessage.POST_ID_MUST_BE_POSITIVE_NUMBER })
  @IsNotEmpty({ message: PostErrorMessage.POST_ID_SHOULD_NOT_BE_EMPTY })
  @ApiProperty()
  postId: number;
}
