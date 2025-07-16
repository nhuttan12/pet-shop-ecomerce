import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '@product/enums/product-status.enum';
import { Expose } from 'class-transformer';

export class WishlistMappingResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  @AutoMap()
  id: number;

  @Expose()
  @ApiProperty({ example: 2 })
  @AutoMap()
  userID: number;

  @Expose()
  @ApiProperty({ example: 2 })
  @AutoMap()
  productID: number;

  @Expose()
  @ApiProperty({ example: 'Sản phẩm ABC' })
  @AutoMap()
  productName: string;

  @Expose()
  @ApiProperty({ example: 250000 })
  @AutoMap()
  productPrice: number;

  @Expose()
  @ApiProperty({ example: 'Petmate' })
  @AutoMap()
  brandName: string;

  @Expose()
  @ApiProperty({ example: 'Đồ chơi' })
  @AutoMap()
  categoryName: string[];

  @Expose()
  @ApiProperty({ example: 'active' })
  @AutoMap()
  status: ProductStatus;

  @Expose()
  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @AutoMap()
  thumbnailUrl: string;

  @Expose()
  @ApiProperty({ example: 5 })
  @AutoMap()
  stock: number;

  @Expose()
  @ApiProperty({ example: '2025-06-05T04:21:21.000Z' })
  @AutoMap()
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2025-06-05T04:21:21.000Z' })
  @AutoMap()
  updatedAt: Date;
}
