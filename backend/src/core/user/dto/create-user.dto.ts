import { AuthErrorMessages } from '@auth/messages/auth.error-messages';
import { NotUrlValidator } from '@class-validator/not-url.validator';
import { ErrorMessage } from '@messages/error.messages';
import { UserStatus } from '@user/enums/user-status.enum';
import { IsString, Validate, IsEmail, IsInt, IsEnum } from 'class-validator';

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
