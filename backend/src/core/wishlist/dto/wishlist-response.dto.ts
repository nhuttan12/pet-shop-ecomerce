import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '@product/enums/product-status.enum';
import { Expose } from 'class-transformer';

export class WishlistMappingResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 2 })
  userID: number;

  @Expose()
  @ApiProperty({ example: 'Sản phẩm ABC' })
  productName: string;

  @Expose()
  @ApiProperty({ example: 250000 })
  productPrice: number;

  @Expose()
  @ApiProperty({ example: 'Petmate' })
  brandName: string;

  @Expose()
  @ApiProperty({ example: 'Đồ chơi' })
  categoryName: string[];

  @Expose()
  @ApiProperty({ example: 'active' })
  status: ProductStatus;

  @Expose()
  @ApiProperty({ example: 'https://example.com/image.jpg' })
  thumbnailUrl: string;

  @Expose()
  @ApiProperty({ example: 5 })
  stock: number;

  @Expose()
  @ApiProperty({ example: '2025-06-05T04:21:21.000Z' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2025-06-05T04:21:21.000Z' })
  updatedAt: Date;
}
