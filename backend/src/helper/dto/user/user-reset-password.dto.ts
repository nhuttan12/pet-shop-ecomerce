import { IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { NotUrlValidator } from 'src/helper/class-validator-contraint/not-url.validator';
import { IsPasswordMatch } from 'src/helper/class-validator-contraint/password-match.validator';
import { ErrorMessage } from 'src/helper/message/error-message';

export class UserResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  @Validate(NotUrlValidator)
  token: string;

  @IsNotEmpty({ message: ErrorMessage.PASSWORD_IS_NOT_EMPTY })
  @MinLength(6, { message: ErrorMessage.PASSWORD_HAVE_AT_LEAST_3_CHARACTERS })
  @Validate(NotUrlValidator)
  password: string;

  @IsNotEmpty({ message: ErrorMessage.PASSWORD_MISMATCH })
  @Validate(IsPasswordMatch)
  @Validate(NotUrlValidator)
  retypePassword: string;
}
