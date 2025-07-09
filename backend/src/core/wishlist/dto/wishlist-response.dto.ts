import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class WishlistResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 2 })
  userId: number;

  @Expose()
  @ApiProperty({ example: 10 })
  productId: number;

  @Expose()
  @ApiProperty({ example: '2025-06-05T04:21:21.000Z' })
  created_at: Date;

  @Expose()
  @ApiProperty({ example: '2025-06-05T04:21:21.000Z' })
  updated_at: Date;
}
