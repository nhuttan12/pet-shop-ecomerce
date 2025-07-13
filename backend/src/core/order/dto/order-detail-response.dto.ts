import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDetailResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 10 })
  orderID: number;

  @Expose()
  @ApiProperty({ example: 5 })
  productID: number;

  @Expose()
  @ApiProperty({ example: 2 })
  quantity: number;

  @Expose()
  @ApiProperty({ example: 100000 })
  price: number;

  @Expose()
  @ApiProperty({ example: 200000 })
  totalPrice: number;
}
