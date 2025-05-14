import { IsString, Validate } from 'class-validator';
import { NotUrlValidator } from 'src/helper/class-validator-contraint/not-url.validator';
import { ErrorMessage } from 'src/helper/message/error-message';

export class SignUrlDTO {
  @IsString({ message: ErrorMessage.PUBLIC_ID_MUST_BE_A_STRING })
  @Validate(NotUrlValidator)
  publicId: string;

  @IsString({ message: ErrorMessage.FOLDER_NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  folder: string;
}
