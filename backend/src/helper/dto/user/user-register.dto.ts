import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { ErrorMessage } from 'src/helper/message/error-message';
import { IsPasswordMatch } from '../../class-validator-contraint/password-match.validator';
import { NotUrlValidator } from 'src/helper/class-validator-contraint/not-url.validator';

export class UserRegisterDto {
  @IsNotEmpty({ message: ErrorMessage.USERNAME_IS_NOT_EMPTY })
  @MinLength(3, { message: ErrorMessage.USER_NAME_HAVE_AT_LEAST_3_CHARACTERS })
  @Validate(NotUrlValidator)
  username: string;

  @IsNotEmpty({ message: ErrorMessage.PASSWORD_IS_NOT_EMPTY })
  @MinLength(6, { message: ErrorMessage.PASSWORD_HAVE_AT_LEAST_3_CHARACTERS })
  @Validate(NotUrlValidator)
  password: string;

  @IsNotEmpty({ message: ErrorMessage.PASSWORD_MISMATCH })
  @Validate(IsPasswordMatch)
  @Validate(NotUrlValidator)
  retypePassword: string;

  @IsNotEmpty({ message: ErrorMessage.EMAIL_IS_NOT_EMPTY })
  @IsEmail({}, { message: ErrorMessage.INVALID_EMAIL })
  @Validate(NotUrlValidator)
  email: string;
}

export class UserRegisterResponseDto {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
}
