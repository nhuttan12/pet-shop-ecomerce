import { ProductRatingErrorMessage } from '@message/product-rating-message';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class ToggleRatingProductRequestDTO {
  @ApiProperty({
    description: 'ID của sản phẩm cần đánh giá',
    example: 101,
  })
  @IsInt({ message: ProductRatingErrorMessage.PRODUCT_ID_MUST_BE_INTEGER })
  @IsNotEmpty({ message: ProductRatingErrorMessage.PRODUCT_ID_REQUIRED })
  @Min(1, { message: ProductRatingErrorMessage.PRODUCT_ID_MUST_BE_POSITIVE })
  productId: number;

  @ApiProperty({
    description: 'Số sao đánh giá từ 1 đến 5',
    example: 4,
  })
  @IsInt({ message: ProductRatingErrorMessage.STAR_RATED_MUST_BE_INTEGER })
  @IsNotEmpty({ message: ProductRatingErrorMessage.STAR_RATED_REQUIRED })
  @Min(1, { message: ProductRatingErrorMessage.STAR_RATED_MUST_BE_POSITIVE })
  starRated: number;
}
