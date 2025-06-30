import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  NotContains,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthErrorMessages } from 'auth/messages/auth.error-messages';
import { IsPasswordMatch, NotUrlValidator } from '@common';

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
