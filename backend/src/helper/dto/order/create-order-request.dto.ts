import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentMethod } from '@enum/payment-method.enum';
import { ShippingMethod } from '@enum/shipping_method.enum';
import { OrderErrorMessage } from '@message/order-error-message';

export class CreateOrderRequestDto {
  @ApiProperty()
  @IsEnum(PaymentMethod, { message: OrderErrorMessage.PAYMENT_METHOD_INVALID })
  @IsNotEmpty({ message: OrderErrorMessage.PAYMENT_METHOD_IS_NOT_EMPTY })
  paymentMethod: PaymentMethod;

  @ApiProperty()
  @IsEnum(PaymentMethod, { message: OrderErrorMessage.SHIPPING_METHOD_INVALID })
  @IsNotEmpty({ message: OrderErrorMessage.SHIPPING_METHOD_IS_NOT_EMPTY })
  shippingMethod: ShippingMethod;
}
