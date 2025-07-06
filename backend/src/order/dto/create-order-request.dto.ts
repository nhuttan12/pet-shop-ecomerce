import { ApiProperty } from '@nestjs/swagger';
import { OrderErrorMessage, PaymentMethod, ShippingMethod } from '@order';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderRequestDto {
  @ApiProperty()
  @IsEnum(PaymentMethod, { message: OrderErrorMessage.PAYMENT_METHOD_INVALID })
  @IsNotEmpty({ message: OrderErrorMessage.PAYMENT_METHOD_IS_NOT_EMPTY })
  paymentMethod: PaymentMethod;

  @ApiProperty()
  @IsEnum(PaymentMethod, { message: OrderErrorMessage.SHIPPING_METHOD_INVALID })
  @IsNotEmpty({ message: OrderErrorMessage.SHIPPING_METHOD_IS_NOT_EMPTY })
  shippingMethod: ShippingMethod;

  @ApiProperty({ description: 'Thành phố giao hàng' })
  @IsString({ message: 'Thành phố phải là chuỗi' })
  @IsNotEmpty({ message: 'Thành phố không được để trống' })
  city: string;

  @ApiProperty({ description: 'Quốc gia giao hàng' })
  @IsString({ message: 'Quốc gia phải là chuỗi' })
  @IsNotEmpty({ message: 'Quốc gia không được để trống' })
  country: string;

  @ApiProperty({ description: 'Địa chỉ giao hàng' })
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;
}
