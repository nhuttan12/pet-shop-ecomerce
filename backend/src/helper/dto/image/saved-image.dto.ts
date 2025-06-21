import { IsEnum, IsOptional, IsString, Validate } from 'class-validator';
import { NotUrlValidator } from '@validator';
import { ErrorMessage } from '@message/error-message';
import { ImageType } from '@enum/image-type.enum';

export class SavedImageDTO {
  @IsString({ message: ErrorMessage.URL_MUST_BE_A_STRING })
  url: string;

  @IsString({ message: ErrorMessage.FOLDER_NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  @IsOptional()
  folder: string;

  @IsEnum(ImageType, { message: ErrorMessage.IMAGE_TYPE_IS_UNVALID })
  @Validate(NotUrlValidator)
  type: ImageType;
}
