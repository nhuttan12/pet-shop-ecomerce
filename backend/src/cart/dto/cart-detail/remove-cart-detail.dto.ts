import { ErrorMessage } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { ProductErrorMessage } from '@product';
import { IsInt, Min } from 'class-validator';

export class RemoveCartDetailDTO {
  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @Min(1)
  @ApiProperty()
  cartID: number;

  @IsInt({ message: ProductErrorMessage.PRODUCT_ID_MUST_BE_INTEGER })
  @Min(1, { message: ProductErrorMessage.PRODUCT_ID_MUST_BE_POSITIVE })
  @ApiProperty()
  productID: number;
}
