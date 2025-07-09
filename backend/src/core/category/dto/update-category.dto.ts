import { CategoryStatus } from '@category/enums/categories-status.enum';
import { NotUrlValidator } from '@class-validator/not-url.validator';
import { SavedImageDTO } from '@images/dto/saved-image.dto';
import { ErrorMessage } from '@messages/error.messages';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  Min,
  IsString,
  Validate,
  IsEnum,
  MinLength,
} from 'class-validator';

export class CategoryUpdateDTO {
  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @IsNotEmpty()
  @ApiProperty()
  @Min(1)
  id: number;

  @IsString({ message: ErrorMessage.NAME_MUST_BE_STRING })
  @IsNotEmpty()
  @Validate(NotUrlValidator)
  @ApiProperty()
  name: string;

  @IsEnum(CategoryStatus, { message: ErrorMessage.STATUS_MUST_BE_ENUM })
  @IsNotEmpty()
  @Validate(NotUrlValidator)
  @MinLength(1)
  @ApiProperty()
  status: CategoryStatus;

  savedImageDTO: SavedImageDTO;
}
