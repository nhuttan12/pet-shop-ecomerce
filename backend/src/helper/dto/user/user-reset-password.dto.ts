import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { NotUrlValidator, IsPasswordMatch } from '@validator';
import { ErrorMessage } from '@message/error-message';

export class UserResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  @Validate(NotUrlValidator)
  @ApiProperty()
  token: string;

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
}
