import { BrandErrorMessages, BrandStatus } from '@brand';
import { ErrorMessage, NotUrlValidator } from '@common';
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

export class BrandUpdateDTO {
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

  @IsEnum(BrandStatus, {
    message: BrandErrorMessages.BRAND_STATUS_MUST_BE_ENUM,
  })
  @IsNotEmpty()
  @Validate(NotUrlValidator)
  @MinLength(1)
  @ApiProperty()
  status: BrandStatus;
}
