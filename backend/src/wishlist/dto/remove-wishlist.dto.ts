import { ApiProperty } from '@nestjs/swagger';
import { WishlistErrorMessage } from '@wishlist/messages/wishlist.error-messages';
import { Min, IsInt } from 'class-validator';

export class RemoveWishlistDto {
  @ApiProperty({ example: 100 })
  @Min(1, { message: WishlistErrorMessage.WISHLIST_ID_MUST_BE_POSITIVE_NUMBER })
  @IsInt({ message: WishlistErrorMessage.WISHLIST_ID_MUST_BE_INTEGER })
  wishlistID: number;
}
