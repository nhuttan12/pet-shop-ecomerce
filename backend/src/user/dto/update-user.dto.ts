import {
  ErrorMessage,
  ImageErrorMessage,
  NotUrlValidator,
  SavedImageDTO,
} from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';

export class UserUpdateDTO {
  @IsInt({ message: ErrorMessage.USER_ID_MUST_BE_INTEGER })
  @ApiProperty()
  id: number;

  @IsString({ message: ErrorMessage.USER_FULL_NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  @ApiProperty()
  name: string;

  @IsString({ message: ErrorMessage.USER_FULL_NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  @ApiProperty()
  email: string;

  @IsString({ message: ErrorMessage.USER_FULL_NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  @ApiProperty()
  phone: string;

  @IsString({ message: ErrorMessage.USER_FULL_NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  @ApiProperty()
  address: string;

  @IsDefined({ message: ImageErrorMessage.IMAGE_IS_REQUIRED })
  @ValidateNested({ message: ImageErrorMessage.IMAGE_INVALID_FORMAT })
  @Type(() => SavedImageDTO) // Quan trọng: Chuyển đổi nested object
  @ApiProperty({ type: SavedImageDTO })
  image: SavedImageDTO;
}
