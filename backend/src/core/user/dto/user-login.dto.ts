import { AuthErrorMessages } from '@auth/messages/auth.error-messages';
import { NotUrlValidator } from '@class-validator/not-url.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, Validate, NotContains } from 'class-validator';

export class UserLoginDTO {
  @IsString({ message: AuthErrorMessages.USERNAME_IS_NOT_EMPTY })
  @MinLength(3, {
    message: AuthErrorMessages.USER_NAME_HAVE_AT_LEAST_3_CHARACTERS,
  })
  @Validate(NotUrlValidator)
  @NotContains(' ')
  @ApiProperty()
  username: string;

  @IsString({ message: AuthErrorMessages.PASSWORD_IS_NOT_EMPTY })
  @MinLength(6, {
    message: AuthErrorMessages.PASSWORD_HAVE_AT_LEAST_3_CHARACTERS,
  })
  @Validate(NotUrlValidator)
  @ApiProperty()
  password: string;
}
