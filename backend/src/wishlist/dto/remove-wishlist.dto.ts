import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { WishlistErrorMessage } from '@message/wishlist-message';

export class RemoveWishlistDto {
  @ApiProperty({ example: 100 })
  @Min(1, { message: WishlistErrorMessage.WISHLIST_ID_MUST_BE_POSITIVE_NUMBER })
  @IsInt({ message: WishlistErrorMessage.WISHLIST_ID_MUST_BE_INTEGER })
  wishlistId: number;
}
