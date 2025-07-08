import { ApiProperty } from '@nestjs/swagger';
import { PostErrorMessage } from '@post/messages/post.error-messages';
import { IsInt, Min, IsOptional, IsString, MaxLength } from 'class-validator';

export class EditPostRequestDto {
  @IsInt({ message: PostErrorMessage.POST_ID_MUST_BE_INTEGER })
  @Min(1, { message: PostErrorMessage.POST_ID_MUST_BE_POSITIVE_NUMBER })
  @ApiProperty()
  postID: number;

  @IsOptional()
  @IsString({ message: PostErrorMessage.POST_TITLE_MUST_BE_A_STRING })
  @MaxLength(255, {
    message: PostErrorMessage.POST_TITLE_HAS_EXCEED_255_CHARACTERS,
  })
  @ApiProperty()
  title?: string;

  @IsOptional()
  @IsString({ message: PostErrorMessage.CONTENT_TITLE_MUST_BE_A_STRING })
  @ApiProperty()
  content?: string;
}
