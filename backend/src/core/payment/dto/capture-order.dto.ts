import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@order/enums/payment-method.enum';
import { ShippingMethod } from '@order/enums/shipping_method.enum';
import { OrderErrorMessage } from '@order/messages/order.error-messages';
import { PaymentErrorMessages } from '@payment/messages/payment.error-messages';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CaptureOrderDto {
  @ApiProperty({
    description:
      'Token được trả về từ PayPal sau khi người dùng chấp nhận thanh toán',
    example: 'EC-2A12345678901234L',
  })
  @IsString({ message: PaymentErrorMessages.PAYPAL_TOKEN_MUST_BE_STRING })
  @IsNotEmpty({ message: PaymentErrorMessages.PAYPAL_TOKEN_IS_REQUIRED })
  paypalToken: string;

  @ApiProperty()
  @IsEnum(PaymentMethod, { message: OrderErrorMessage.SHIPPING_METHOD_INVALID })
  @IsNotEmpty({ message: OrderErrorMessage.SHIPPING_METHOD_IS_NOT_EMPTY })
  shippingMethod: ShippingMethod;
}
