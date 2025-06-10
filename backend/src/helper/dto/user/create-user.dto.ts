import { IsEmail, IsEnum, IsInt, IsString, Validate } from 'class-validator';
import { NotUrlValidator } from '@validator';
import { ErrorMessage } from '@message/error-message';
import { UserStatus } from '@enum/status/user-status.enum';

export class CreateUserDto {
  @IsString({ message: ErrorMessage.PARAM_NOT_VALID })
  @Validate(NotUrlValidator)
  username: string;

  @IsEmail({}, { message: ErrorMessage.INVALID_EMAIL })
  @Validate(NotUrlValidator)
  email: string;

  @IsString({ message: ErrorMessage.PARAM_NOT_VALID })
  @Validate(NotUrlValidator)
  hashedPassword: string;

  @IsInt({ message: ErrorMessage.PARAM_NOT_VALID })
  roleId: number;

  @IsEnum({ message: ErrorMessage.PARAM_NOT_VALID })
  status: UserStatus;
}
