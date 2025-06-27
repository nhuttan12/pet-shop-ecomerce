import { ErrorMessage, NotUrlValidator } from '@common';
import { UserStatus } from '@user';
import { AuthErrorMessages } from 'auth/messages/auth.error-messages';
import { IsEmail, IsEnum, IsInt, IsString, Validate } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: ErrorMessage.PARAM_NOT_VALID })
  @Validate(NotUrlValidator)
  username: string;

  @IsEmail({}, { message: AuthErrorMessages.INVALID_EMAIL })
  @Validate(NotUrlValidator)
  email: string;

  @IsString({ message: ErrorMessage.PARAM_NOT_VALID })
  @Validate(NotUrlValidator)
  hashedPassword: string;

  @IsInt({ message: ErrorMessage.PARAM_NOT_VALID })
  roleId: number;

  @IsEnum(UserStatus, { message: ErrorMessage.PARAM_NOT_VALID })
  status: UserStatus;
}
