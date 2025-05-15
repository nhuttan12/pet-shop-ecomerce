import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { NotUrlValidator } from 'src/helper/class-validator-contraint/not-url.validator';

export class UserResetPasswordDTO {
  @IsNotEmpty()
  @IsEmail()
  @Validate(NotUrlValidator)
  email: string;
}
