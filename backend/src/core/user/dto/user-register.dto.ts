import { AuthErrorMessages } from '@auth/messages/auth.error-messages';
import { NotUrlValidator } from '@class-validator/not-url.validator';
import { IsPasswordMatch } from '@class-validator/password-match.validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MinLength,
  Validate,
  NotContains,
  IsEmail,
} from 'class-validator';

export class UserRegisterDTO {
  @IsNotEmpty({ message: AuthErrorMessages.USERNAME_IS_NOT_EMPTY })
  @MinLength(3, {
    message: AuthErrorMessages.USER_NAME_HAVE_AT_LEAST_3_CHARACTERS,
  })
  @Validate(NotUrlValidator)
  @NotContains(' ')
  @ApiProperty()
  username: string;

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

  @IsNotEmpty({ message: AuthErrorMessages.EMAIL_IS_NOT_EMPTY })
  @IsEmail({}, { message: AuthErrorMessages.INVALID_EMAIL })
  @NotContains(' ')
  @ApiProperty()
  email: string;
}
