import { IsEnum, IsOptional, IsString, Validate } from 'class-validator';
import { NotUrlValidator } from 'src/helper/class-validator-contraint/not-url.validator';
import { ErrorMessage } from 'src/helper/message/error-message';
import { ImageType } from '../../enum/image-type.enum';

export class SavedImageDTO {
  @IsString({ message: ErrorMessage.URL_MUST_BE_A_STRING })
  @Validate(NotUrlValidator)
  url: string;

  @IsString({ message: ErrorMessage.FOLDER_NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  @IsOptional()
  folder: string;

  @IsEnum({ message: ErrorMessage.IMAGE_TYPE_IS_UNVALID })
  @Validate(NotUrlValidator)
  type: ImageType;
}
