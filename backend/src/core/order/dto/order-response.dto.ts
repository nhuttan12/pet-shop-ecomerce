import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@order/enums/order-status.enum';
import { PaymentMethod } from '@order/enums/payment-method.enum';
import { ShippingMethod } from '@order/enums/shipping_method.enum';
import { Expose } from 'class-transformer';

export class OrderResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 12 })
  userID: number;

  @Expose()
  @ApiProperty({ example: 1500000 })
  totalPrice: number;

  @Expose()
  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.COD })
  paymentMethod: PaymentMethod;

  @Expose()
  @ApiProperty({
    enum: ShippingMethod,
    example: ShippingMethod.ECONOMY_DELIVERY,
  })
  shippingMethod: ShippingMethod;

  @Expose()
  @Optional()
  @ApiProperty({ example: 3, nullable: true })
  voucherID?: number;

  @Expose()
  @ApiProperty({ example: '123 Đường ABC, P.X, Q.Y' })
  address: string;

  @Expose()
  @ApiProperty({ example: 'Hồ Chí Minh' })
  city: string;

  @Expose()
  @ApiProperty({ example: 'Việt Nam' })
  country: string;

  @Expose()
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
  status: OrderStatus;

  @Expose()
  @ApiProperty({ example: '2025-07-01T10:00:00.000Z' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2025-07-01T10:05:00.000Z' })
  updatedAt: Date;
}
