import { AuthErrorMessages } from '@auth/messages/auth.error-messages';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserForgotPasswordDTO {
  @IsNotEmpty({ message: AuthErrorMessages.EMAIL_IS_NOT_EMPTY })
  @IsEmail()
  @ApiProperty()
  email: string;
}
