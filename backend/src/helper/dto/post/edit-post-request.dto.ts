import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { PostErrorMessage } from 'src/helper/message/post_message';

export class EditPostRequestDto {
  @IsOptional()
  @IsString({ message: PostErrorMessage.POST_TITLE_MUST_BE_A_STRING })
  @MaxLength(255, {
    message: PostErrorMessage.POST_TITLE_HAS_EXCEED_255_CHARACTERS,
  })
  title?: string;

  @IsOptional()
  @IsString({ message: PostErrorMessage.CONTENT_TITLE_MUST_BE_A_STRING })
  content?: string;

  @IsOptional()
  @IsInt({ message: PostErrorMessage.USER_ID_MUST_BE_INTEGER })
  authorId?: number;
}
