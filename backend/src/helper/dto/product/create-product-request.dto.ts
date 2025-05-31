import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { SavedImageDTO } from '../image/saved-image.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorMessage } from 'src/helper/message/error-message';
import { Type } from 'class-transformer';

export class CreateProductRequest {
  @IsString({ message: ErrorMessage.NAME_MUST_BE_STRING })
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString({ message: ErrorMessage.NAME_MUST_BE_STRING })
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsInt({ message: ErrorMessage.PRICE_MUST_BE_INTEGER })
  @IsNotEmpty()
  @Min(1, { message: ErrorMessage.PARAM_SHOULD_NOT_BE_A_NEGATIVE_NUMBER })
  @ApiProperty()
  price: number;

  @IsString({ message: ErrorMessage.BRAND_FULL_NAME_MUST_BE_STRING })
  @IsNotEmpty()
  @ApiProperty()
  brandName: string;

  @IsInt({ message: ErrorMessage.PRICE_MUST_BE_INTEGER })
  @IsNotEmpty()
  @Min(1, { message: ErrorMessage.PARAM_SHOULD_NOT_BE_A_NEGATIVE_NUMBER })
  @ApiProperty()
  quantity: number;

  @IsInt({ message: ErrorMessage.PRICE_MUST_BE_INTEGER })
  @IsNotEmpty()
  @Min(1, { message: ErrorMessage.PARAM_SHOULD_NOT_BE_A_NEGATIVE_NUMBER })
  @ApiProperty()
  discount: number = 0;

  @IsString({ message: ErrorMessage.CATEGORY_MUST_BE_STRING })
  @IsNotEmpty()
  @ApiProperty()
  categoryName: string;

  @ValidateNested()
  @Type(() => SavedImageDTO)
  mainImage: SavedImageDTO;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SavedImageDTO)
  subImages: SavedImageDTO[];
}
