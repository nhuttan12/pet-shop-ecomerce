import { ApiProperty } from '@nestjs/swagger';
import { PostErrorMessage } from '@post/messages/post.error-messages';
import { IsInt, Min, IsNotEmpty } from 'class-validator';

export class DeletePostRequestDto {
  @IsInt({ message: PostErrorMessage.POST_ID_MUST_BE_POSITIVE_NUMBER })
  @Min(1, { message: PostErrorMessage.POST_ID_MUST_BE_POSITIVE_NUMBER })
  @IsNotEmpty({ message: PostErrorMessage.POST_ID_SHOULD_NOT_BE_EMPTY })
  @ApiProperty()
  postID: number;
}
