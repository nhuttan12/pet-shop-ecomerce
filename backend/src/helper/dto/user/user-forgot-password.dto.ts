import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { NotUrlValidator } from 'src/helper/class-validator-contraint/not-url.validator';
import { ErrorMessage } from 'src/helper/message/error-message';

export class UserForgotPasswordDTO {
  @IsNotEmpty({ message: ErrorMessage.EMAIL_IS_NOT_EMPTY })
  @IsEmail()
  @Validate(NotUrlValidator)
  email: string;
}
