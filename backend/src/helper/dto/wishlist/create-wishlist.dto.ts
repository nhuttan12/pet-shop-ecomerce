import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { WishlistErrorMessage } from 'src/helper/message/wishlist-message';

export class CreateWishlistDto {
  @ApiProperty({ example: 10 })
  @Min(1, { message: WishlistErrorMessage.PRODUCT_ID_MUST_BE_POSITIVE_NUMBER })
  @IsInt({ message: WishlistErrorMessage.PRODUCT_ID_MUST_BE_INTEGER })
  productId: number;
}
