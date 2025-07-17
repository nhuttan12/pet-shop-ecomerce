import { AutoMap } from '@automapper/classes';
import { NotUrlValidator } from '@class-validator/not-url.validator';
import { SavedImageDTO } from '@images/dto/saved-image.dto';
import { ImageErrorMessage } from '@images/messages/image.error-messages';
import { ErrorMessage } from '@messages/error.messages';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@user/enums/gender.enum';
import { UserErrorMessage } from '@user/messages/user.error-messages';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsString,
  Validate,
  IsDefined,
  ValidateNested,
  IsEnum,
} from 'class-validator';

export class UserUpdateDTO {
  @IsInt({ message: ErrorMessage.USER_ID_MUST_BE_INTEGER })
  @ApiProperty()
  @AutoMap()
  id: number;

  @IsString({ message: ErrorMessage.USER_FULL_NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  @ApiProperty()
  @AutoMap()
  name: string;

  @IsString({ message: ErrorMessage.USER_FULL_NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  @ApiProperty()
  @AutoMap()
  email: string;

  @IsString({ message: ErrorMessage.USER_FULL_NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  @ApiProperty()
  @AutoMap()
  phone: string;

  @IsString({ message: ErrorMessage.USER_FULL_NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  @ApiProperty()
  @AutoMap()
  address: string;

  @IsEnum({}, { message: UserErrorMessage.GENDER_IS_NOT_VALID })
  @ApiProperty()
  @AutoMap()
  gender: Gender;

  @IsString({ message: UserErrorMessage.USER_BIRTH_DATE_IS_NOT_VALID })
  @Validate(NotUrlValidator)
  @ApiProperty()
  @AutoMap()
  birhDate: Date;

  @IsDefined({ message: ImageErrorMessage.IMAGE_IS_REQUIRED })
  @ValidateNested({ message: ImageErrorMessage.IMAGE_INVALID_FORMAT })
  @Type(() => SavedImageDTO)
  @ApiProperty({ type: SavedImageDTO })
  @AutoMap()
  image: SavedImageDTO;
}
