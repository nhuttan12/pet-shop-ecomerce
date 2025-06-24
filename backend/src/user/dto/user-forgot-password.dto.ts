import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ErrorMessage } from '@message/error-message';

export class UserForgotPasswordDTO {
  @IsNotEmpty({ message: ErrorMessage.EMAIL_IS_NOT_EMPTY })
  @IsEmail()
  @ApiProperty()
  email: string;
}
