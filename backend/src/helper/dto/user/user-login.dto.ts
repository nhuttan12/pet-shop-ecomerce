import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, NotContains, Validate } from 'class-validator';
import { NotUrlValidator } from 'src/helper/class-validator-contraint/not-url.validator';
import { ErrorMessage } from 'src/helper/message/error-message';

export class UserLoginDTO {
  @IsString({ message: ErrorMessage.USERNAME_IS_NOT_EMPTY })
  @MinLength(3, { message: ErrorMessage.USER_NAME_HAVE_AT_LEAST_3_CHARACTERS })
  @Validate(NotUrlValidator)
  @NotContains(' ')
  @ApiProperty()
  username: string;

  @IsString({ message: ErrorMessage.PASSWORD_IS_NOT_EMPTY })
  @MinLength(6, { message: ErrorMessage.PASSWORD_HAVE_AT_LEAST_3_CHARACTERS })
  @Validate(NotUrlValidator)
  @ApiProperty()
  password: string;
}

export class UserLoginResponseDTO {
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    status: string;
  };
}
