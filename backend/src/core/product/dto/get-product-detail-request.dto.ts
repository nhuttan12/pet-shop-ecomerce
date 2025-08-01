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
}
