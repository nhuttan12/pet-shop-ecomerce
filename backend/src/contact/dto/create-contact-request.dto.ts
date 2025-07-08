import { NotUrlValidator } from '@class-validator/not-url.validator';
import { ContactErrorMessage } from '@contact/messages/contact.error-messages';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Validate, IsEmail } from 'class-validator';

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
