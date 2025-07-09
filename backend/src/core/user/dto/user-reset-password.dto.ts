import { AuthErrorMessages } from '@auth/messages/auth.error-messages';
import { NotUrlValidator } from '@class-validator/not-url.validator';
import { IsPasswordMatch } from '@class-validator/password-match.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Validate, MinLength } from 'class-validator';

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
