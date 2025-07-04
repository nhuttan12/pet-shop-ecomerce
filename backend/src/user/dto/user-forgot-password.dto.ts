import { ApiProperty } from '@nestjs/swagger';
import { AuthErrorMessages } from 'auth/messages/auth.error-messages';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserForgotPasswordDTO {
  @IsNotEmpty({ message: AuthErrorMessages.EMAIL_IS_NOT_EMPTY })
  @IsEmail()
  @ApiProperty()
  email: string;
}
