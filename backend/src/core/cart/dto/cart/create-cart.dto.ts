import { ErrorMessage } from '@messages/error.messages';
import { ApiProperty } from '@nestjs/swagger';
import { ProductErrorMessage } from '@product/messages/product.error-messages';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CartCreateDTO {
  @ApiProperty()
  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @IsNotEmpty({ message: ProductErrorMessage.PRODUCT_ID_REQUIRED })
  @Min(1, {
    message: ProductErrorMessage.PRODUCT_ID_MUST_BE_POSITIVE,
  })
  productID: number;

  @ApiProperty()
  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @IsNotEmpty({ message: ProductErrorMessage.QUANTITY_IS_REQUIRED })
  @Min(1, {
    message: ProductErrorMessage.QUANTITY_MUST_BE_POSITIVE,
  })
  quantity: number;
}
