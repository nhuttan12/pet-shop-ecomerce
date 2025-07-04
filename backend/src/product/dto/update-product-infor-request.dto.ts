import { BrandErrorMessages } from '@brand';
import { CategoryErrorMessages } from '@category';
import { SavedImageDTO } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { ProductErrorMessage, ProductStatus } from '@product';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class UpdateProductInforRequestDTO {
  @Type(() => Number)
  @IsInt({ message: ProductErrorMessage.ID_MUST_BE_INTEGER })
  @Min(1, {
    message: ProductErrorMessage.ID_SHOULD_NOT_BE_A_NEGATIVE_NUMBER,
  })
  @ApiProperty()
  id: number;

  @Type(() => String)
  @IsString({ message: ProductErrorMessage.NAME_MUST_BE_STRING })
  @IsNotEmpty({ message: ProductErrorMessage.NAME_IS_NOT_EMPTY })
  @ApiProperty()
  name: string;

  @Type(() => String)
  @IsString({
    message: ProductErrorMessage.DESCRIPTION_MUST_BE_STRING,
  })
  @IsNotEmpty({ message: ProductErrorMessage.NAME_IS_NOT_EMPTY })
  @ApiProperty()
  description: string;

  @Type(() => Number)
  @IsInt({
    message: ProductErrorMessage.PRICE_MUST_BE_INTEGER,
  })
  @IsNotEmpty({ message: ProductErrorMessage.PRICE_IS_NOT_EMPTY })
  @Min(1, {
    message: ProductErrorMessage.PRICE_SHOULD_NOT_BE_A_NEGATIVE_NUMBER,
  })
  @ApiProperty()
  price: number;

  @Type(() => Number)
  @IsInt({ message: BrandErrorMessages.BRAND_ID_MUST_BE_INTEGER })
  @Min(1, { message: BrandErrorMessages.BRAND_ID_MUST_BE_POSITIVE_NUMBER })
  @ApiProperty()
  brandID: number;

  @IsArray()
  @Type(() => Number)
  @IsInt({ message: CategoryErrorMessages.CATEGORY_ID_MUST_BE_INTEGER })
  @Min(1, {
    each: true,
    message: CategoryErrorMessages.CATEGORY_ID_MUST_BE_POSITIVE_NUMBER,
  })
  @ApiProperty({ type: [Number] })
  categoryIDs: number[];

  @Type(() => Enumerator)
  @IsEnum(ProductStatus, {
    message: ProductErrorMessage.PRODUCT_STATUS_IS_UNVALID,
  })
  @IsNotEmpty({ message: ProductErrorMessage.STATUS_IS_NOT_EMPTY })
  @ApiProperty()
  status: ProductStatus;

  @Type(() => Number)
  @IsInt({
    message: ProductErrorMessage.STOCK_MUST_BE_INTEGER,
  })
  @IsNotEmpty({ message: ProductErrorMessage.STOCK_IS_NOT_EMPTY })
  @Min(1, {
    message: ProductErrorMessage.STOCK_SHOULD_NOT_BE_NEGATIVE,
  })
  @ApiProperty()
  stock: number;

  @ValidateNested()
  @IsOptional()
  @Type(() => SavedImageDTO)
  mainImage: SavedImageDTO;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SavedImageDTO)
  subImages: SavedImageDTO[];
}
