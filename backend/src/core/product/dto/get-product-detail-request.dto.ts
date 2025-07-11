import { ErrorMessage } from '@messages/error.messages';
import { ApiProperty } from '@nestjs/swagger';
import { ProductErrorMessage } from '@product/messages/product.error-messages';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetProductDetailRequestDto {
  @Type(() => Number)
  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @Min(1, {
    message: ProductErrorMessage.PRODUCT_ID_MUST_BE_POSITIVE,
  })
  @ApiProperty()
  productID: number;

  // @ApiPropertyOptional({ default: 1 })
  // @IsOptional()
  // @Type(() => Number)
  // @IsInt({ message: ErrorMessage.PAGE_MUST_BE_INTETER })
  // @Min(1, { message: ErrorMessage.PAGE_SHOULD_NOT_A_NEGATIVE_NUMBER })
  // page: number;

  // @ApiPropertyOptional({ default: 10 })
  // @IsOptional()
  // @Type(() => Number)
  // @IsInt({ message: ErrorMessage.LIMIT_MUST_BE_INTETER })
  // @Min(10, { message: ErrorMessage.LIMIT_HAVE_AT_LEAST_10 })
  // limit: number;
}
