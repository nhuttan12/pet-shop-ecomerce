import { AutoMap } from '@automapper/classes';
import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@order/enums/order-status.enum';
import { PaymentMethod } from '@order/enums/payment-method.enum';
import { ShippingMethod } from '@order/enums/shipping_method.enum';
import { Expose } from 'class-transformer';

export class OrderResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  @AutoMap()
  id: number;

  @Expose()
  @ApiProperty({ example: 12 })
  @AutoMap()
  userID: number;

  @Expose()
  @ApiProperty({ example: 1500000 })
  @AutoMap()
  totalPrice: number;

  @Expose()
  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CREDIT_CARD })
  @AutoMap()
  paymentMethod: PaymentMethod;

  @Expose()
  @ApiProperty({
    enum: ShippingMethod,
    example: ShippingMethod.ECONOMY_DELIVERY,
  })
  @AutoMap()
  shippingMethod: ShippingMethod;

  @Expose()
  @Optional()
  @ApiProperty({ example: 3, nullable: true })
  @AutoMap()
  voucherID?: number;

  @Expose()
  @ApiProperty({ example: '123 Đường ABC, P.X, Q.Y' })
  @AutoMap()
  address: string;

  @Expose()
  @ApiProperty({ example: 'Hồ Chí Minh' })
  @AutoMap()
  city: string;

  @Expose()
  @ApiProperty({ example: 'Việt Nam' })
  @AutoMap()
  country: string;

  @Expose()
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
  @AutoMap()
  status: OrderStatus;

  @Expose()
  @ApiProperty({ example: '2025-07-01T10:00:00.000Z' })
  @AutoMap()
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2025-07-01T10:05:00.000Z' })
  @AutoMap()
  updatedAt: Date;
}
