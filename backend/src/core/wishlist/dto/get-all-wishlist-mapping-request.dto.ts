import { ErrorMessage } from '@messages/error.messages';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { WishlistErrorMessage } from '@wishlist/messages/wishlist.error-messages';
import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional } from 'class-validator';

export class GetAllWishListMappingDTO {
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt({ message: WishlistErrorMessage.PRODUCT_ID_MUST_BE_INTEGER })
  @Min(1, { message: WishlistErrorMessage.PRODUCT_ID_MUST_BE_POSITIVE_NUMBER })
  userID: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: ErrorMessage.PAGE_MUST_BE_INTETER })
  @Min(1, { message: ErrorMessage.PAGE_SHOULD_NOT_A_NEGATIVE_NUMBER })
  page: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: ErrorMessage.LIMIT_MUST_BE_INTETER })
  @Min(10, { message: ErrorMessage.LIMIT_HAVE_AT_LEAST_10 })
  limit: number;
}
