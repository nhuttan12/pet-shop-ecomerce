import { ErrorMessage } from '@messages/error.messages';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class GetUserProfileByUserIdRequestDto {
  @IsInt({ message: ErrorMessage.USER_ID_MUST_BE_INTEGER })
  @ApiProperty()
  userID: number;
}
