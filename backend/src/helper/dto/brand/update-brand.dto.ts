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
import { NotUrlValidator } from 'src/helper/class-validator-contraint/not-url.validator';
import { BrandStatus } from 'src/helper/enum/status/brand-status.enum';
import { ErrorMessage } from 'src/helper/message/error-message';

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

  @IsEnum({}, { message: ErrorMessage.STATUS_MUST_BE_ENUM })
  @IsNotEmpty()
  @Validate(NotUrlValidator)
  @MinLength(1)
  @ApiProperty()
  status: BrandStatus;
}
