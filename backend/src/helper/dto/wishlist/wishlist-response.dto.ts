import { ApiProperty } from '@nestjs/swagger';

export class WishlistResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 2 })
  userId: number;

  @ApiProperty({ example: 10 })
  productId: number;

  @ApiProperty({ example: '2025-06-05T04:21:21.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2025-06-05T04:21:21.000Z' })
  updated_at: Date;
}
