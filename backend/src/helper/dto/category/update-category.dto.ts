import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import { NotUrlValidator } from '@validator';
import { CategoryStatus } from '@enum/status/categories-status.enum';
import { ErrorMessage } from '@message/error-message';
import { SavedImageDTO } from '@dtos/image/saved-image.dto';

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
