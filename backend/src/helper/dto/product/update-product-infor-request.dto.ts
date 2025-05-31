import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { ProductStatus } from 'src/helper/enum/status/product-status.enum';
import { ErrorMessage } from 'src/helper/message/error-message';
import { Property } from 'src/helper/message/property';
import { SavedImageDTO } from '../image/saved-image.dto';

export class UpdateProductInforRequestDTO {
  @Type(() => Number)
  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @Min(1, {
    message: `${Property.ID} ${ErrorMessage.SHOULD_NOT_BE_A_NEGATIVE_NUMBER}`,
  })
  @ApiProperty()
  id: number;

  @Type(() => String)
  @IsString({ message: ErrorMessage.NAME_MUST_BE_STRING })
  @IsNotEmpty({ message: ErrorMessage.NAME_IS_NOT_EMPTY })
  @ApiProperty()
  name: string;

  @Type(() => String)
  @IsString({
    message: `${Property.DESCRIPTION} ${ErrorMessage.MUST_BE_STRING}`,
  })
  @IsNotEmpty({ message: ErrorMessage.NAME_IS_NOT_EMPTY })
  @ApiProperty()
  description: string;

  @Type(() => Number)
  @IsInt({
    message: `${Property.PRICE} ${ErrorMessage.MUST_BE_INTEGER}`,
  })
  @IsNotEmpty({ message: `${Property.PRICE} ${ErrorMessage.IS_NOT_EMPTY}` })
  @Min(1, {
    message: `${Property.PRICE} ${ErrorMessage.SHOULD_NOT_BE_A_NEGATIVE_NUMBER}`,
  })
  @ApiProperty()
  price: number;

  @Type(() => String)
  @IsString({
    message: `${Property.BRAND_NAME} ${ErrorMessage.MUST_BE_STRING}`,
  })
  @IsNotEmpty({
    message: `${Property.BRAND_NAME} ${ErrorMessage.IS_NOT_EMPTY}`,
  })
  @ApiProperty()
  brandName: string;

  @Type(() => String)
  @IsString({
    message: `${Property.CATEGORY_NAME} ${ErrorMessage.MUST_BE_STRING}`,
  })
  @IsNotEmpty({
    message: `${Property.CATEGORY_NAME} ${ErrorMessage.IS_NOT_EMPTY}`,
  })
  @ApiProperty()
  categoryName: string;

  @Type(() => Enumerator)
  @IsEnum({
    message: `${Property.STATUS} ${ErrorMessage.MUST_BE_STRING}`,
  })
  @IsNotEmpty({ message: `${Property.STATUS} ${ErrorMessage.IS_NOT_EMPTY}` })
  @ApiProperty()
  status: ProductStatus;

  @Type(() => Number)
  @IsInt({
    message: `${Property.STOCK} ${ErrorMessage.MUST_BE_INTEGER}`,
  })
  @IsNotEmpty({ message: `${Property.STOCK} ${ErrorMessage.IS_NOT_EMPTY}` })
  @Min(1, {
    message: `${Property.STOCK} ${ErrorMessage.SHOULD_NOT_BE_A_NEGATIVE_NUMBER}`,
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
