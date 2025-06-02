import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  NotContains,
  Validate,
} from 'class-validator';
import { ErrorMessage } from 'src/helper/message/error-message';
import { IsPasswordMatch } from '../../class-validator-contraint/password-match.validator';
import { NotUrlValidator } from 'src/helper/class-validator-contraint/not-url.validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDTO {
  @IsNotEmpty({ message: ErrorMessage.USERNAME_IS_NOT_EMPTY })
  @MinLength(3, { message: ErrorMessage.USER_NAME_HAVE_AT_LEAST_3_CHARACTERS })
  @Validate(NotUrlValidator)
  @NotContains(' ')
  @ApiProperty()
  username: string;

  @IsNotEmpty({ message: ErrorMessage.PASSWORD_IS_NOT_EMPTY })
  @MinLength(6, { message: ErrorMessage.PASSWORD_HAVE_AT_LEAST_3_CHARACTERS })
  @Validate(NotUrlValidator)
  @ApiProperty()
  password: string;

  @IsNotEmpty({ message: ErrorMessage.PASSWORD_MISMATCH })
  @Validate(IsPasswordMatch)
  @Validate(NotUrlValidator)
  @ApiProperty()
  retypePassword: string;

  @IsNotEmpty({ message: ErrorMessage.EMAIL_IS_NOT_EMPTY })
  @IsEmail({}, { message: ErrorMessage.INVALID_EMAIL })
  @NotContains(' ')
  @ApiProperty()
  email: string;
}

export class UserRegisterResponseDTO {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
}
