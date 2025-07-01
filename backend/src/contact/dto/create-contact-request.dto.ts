import { NotUrlValidator } from '@common';
import { ContactErrorMessage } from '@contact';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';

export class CreateContactRequestDto {
  @ApiProperty()
  @IsString({ message: ContactErrorMessage.CONTACT_NAME_MUST_BE_STRING })
  @IsNotEmpty({ message: ContactErrorMessage.CONTACT_NAME_IS_NOT_EMPTY })
  @Validate(NotUrlValidator)
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: ContactErrorMessage.CONTACT_EMAIL_MUST_BE_STRING })
  @IsNotEmpty({ message: ContactErrorMessage.CONTACT_EMAIL_IS_NOT_EMPTY })
  email: string;

  @ApiProperty()
  @IsString({ message: ContactErrorMessage.CONTACT_TITLE_MUST_BE_STRING })
  @IsNotEmpty({ message: ContactErrorMessage.CONTACT_TITLE_IS_NOT_EMPTY })
  @Validate(NotUrlValidator)
  title: string;

  @ApiProperty()
  @IsString({ message: ContactErrorMessage.CONTACT_MESSAGE_MUST_BE_STRING })
  @IsNotEmpty({ message: ContactErrorMessage.CONTACT_MESSAGE_IS_NOT_EMPTY })
  @Validate(NotUrlValidator)
  message: string;
}
