import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PostErrorMessage } from '@message/post-message';

export class EditPostRequestDto {
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
