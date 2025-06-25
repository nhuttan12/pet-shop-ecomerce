import { ApiProperty } from '@nestjs/swagger';
import { WishlistErrorMessage } from '@wishlist';
import { IsInt, Min } from 'class-validator';

export class CreateWishlistDto {
  @ApiProperty({ example: 10 })
  @Min(1, { message: WishlistErrorMessage.PRODUCT_ID_MUST_BE_POSITIVE_NUMBER })
  @IsInt({ message: WishlistErrorMessage.PRODUCT_ID_MUST_BE_INTEGER })
  productId: number;
}
