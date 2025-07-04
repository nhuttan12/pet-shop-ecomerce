import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ProductErrorMessage } from 'product/messages';

export class ToggleRatingProductRequestDTO {
  @ApiProperty({
    description: 'ID của sản phẩm cần đánh giá',
    example: 101,
  })
  @IsInt({ message: ProductErrorMessage.PRODUCT_ID_MUST_BE_INTEGER })
  @IsNotEmpty({ message: ProductErrorMessage.PRODUCT_ID_REQUIRED })
  @Min(1, { message: ProductErrorMessage.PRODUCT_ID_MUST_BE_POSITIVE })
  productID: number;

  @ApiProperty({
    description: 'Số sao đánh giá từ 1 đến 5',
    example: 4,
  })
  @IsInt({ message: ProductErrorMessage.STAR_RATED_MUST_BE_INTEGER })
  @IsNotEmpty({ message: ProductErrorMessage.STAR_RATED_REQUIRED })
  @Min(1, { message: ProductErrorMessage.STAR_RATED_MUST_BE_POSITIVE })
  starRated: number;
}
