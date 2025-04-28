import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ErrorMessage } from 'src/helper/message/error-message';

export class UserRegisterDto {
  @IsNotEmpty({ message: ErrorMessage.USERNAME_IS_NOT_EMPTY })
  @MinLength(3, { message: ErrorMessage.USER_NAME_HAVE_AT_LEAST_3_CHARACTERS })
  username: string;

  @IsNotEmpty({ message: ErrorMessage.PASSWORD_IS_NOT_EMPTY })
  @MinLength(6, { message: ErrorMessage.PASSWORD_HAVE_AT_LEAST_3_CHARACTERS })
  password: string;
  @IsNotEmpty({ message: ErrorMessage.PASSWORD_MISMATCH })
  retypePassword: string;

  @IsNotEmpty({ message: ErrorMessage.EMAIL_IS_NOT_EMPTY })
  @IsEmail({}, { message: ErrorMessage.INVALID_EMAIL })
  email: string;
}

export class UserRegisterResponseDto {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
}
