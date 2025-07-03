import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ErrorMessage, SavedImageDTO } from '@common';
import { BrandErrorMessages } from '@brand';
import { CategoryErrorMessages } from '@category';

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
  @Min(0, { message: ErrorMessage.PARAM_SHOULD_NOT_BE_A_NEGATIVE_NUMBER })
  @ApiProperty()
  price: number;

  @IsInt({ message: BrandErrorMessages.BRAND_ID_MUST_BE_INTEGER })
  @Min(1, { message: BrandErrorMessages.BRAND_ID_MUST_BE_POSITIVE_NUMBER })
  @ApiProperty()
  brandID: number;

  @IsInt({ message: ErrorMessage.PRICE_MUST_BE_INTEGER })
  @IsNotEmpty()
  @Min(1, { message: ErrorMessage.PARAM_SHOULD_NOT_BE_A_NEGATIVE_NUMBER })
  @ApiProperty()
  quantity: number;

  @IsInt({ message: ErrorMessage.PRICE_MUST_BE_INTEGER })
  @Min(0, { message: ErrorMessage.PARAM_SHOULD_NOT_BE_A_NEGATIVE_NUMBER })
  @ApiProperty()
  discount: number = 0;

  @IsString({ message: CategoryErrorMessages.CATEGORY_ID_MUST_BE_INTEGER })
  @Min(1, {
    message: CategoryErrorMessages.CATEGORY_ID_MUST_BE_POSITIVE_NUMBER,
  })
  @ApiProperty()
  categoryID: number;

  @ValidateNested()
  @Type(() => SavedImageDTO)
  mainImage: SavedImageDTO;

  @IsArray({ message: ErrorMessage.SUB_IMAGES_MUST_BE_ARRAY })
  @ValidateNested({ each: true })
  @Type(() => SavedImageDTO)
  subImages: SavedImageDTO[];
}
