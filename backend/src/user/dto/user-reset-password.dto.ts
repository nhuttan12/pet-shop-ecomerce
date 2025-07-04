import { IsPasswordMatch, NotUrlValidator } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { AuthErrorMessages } from 'auth/messages/auth.error-messages';
import { IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';

export class UserResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  @Validate(NotUrlValidator)
  @ApiProperty()
  token: string;

  @IsNotEmpty({ message: AuthErrorMessages.PASSWORD_IS_NOT_EMPTY })
  @MinLength(6, {
    message: AuthErrorMessages.PASSWORD_HAVE_AT_LEAST_3_CHARACTERS,
  })
  @Validate(NotUrlValidator)
  @ApiProperty()
  password: string;

  @IsNotEmpty({ message: AuthErrorMessages.PASSWORD_MISMATCH })
  @Validate(IsPasswordMatch)
  @Validate(NotUrlValidator)
  @ApiProperty()
  retypePassword: string;
}
