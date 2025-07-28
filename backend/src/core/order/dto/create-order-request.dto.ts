import { NotUrlValidator } from '@class-validator/not-url.validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@order/enums/payment-method.enum';
import { ShippingMethod } from '@order/enums/shipping_method.enum';
import { OrderErrorMessage } from '@order/messages/order.error-messages';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Validate,
} from 'class-validator';

export class CreateOrderRequestDto {
  @ApiProperty()
  @IsEnum(PaymentMethod, { message: OrderErrorMessage.PAYMENT_METHOD_INVALID })
  @IsNotEmpty({ message: OrderErrorMessage.PAYMENT_METHOD_IS_NOT_EMPTY })
  paymentMethod: PaymentMethod;

  @ApiProperty()
  @IsEnum(PaymentMethod, { message: OrderErrorMessage.SHIPPING_METHOD_INVALID })
  @IsNotEmpty({ message: OrderErrorMessage.SHIPPING_METHOD_IS_NOT_EMPTY })
  shippingMethod: ShippingMethod;

  @ApiProperty({ description: 'Thành phố giao hàng', example: 'HCM' })
  @IsString({ message: 'Thành phố phải là chuỗi' })
  @IsNotEmpty({ message: 'Thành phố không được để trống' })
  city: string;

  @ApiProperty({ description: 'Quốc gia giao hàng', example: 'VN' })
  @IsString({ message: 'Quốc gia phải là chuỗi' })
  @IsNotEmpty({ message: 'Quốc gia không được để trống' })
  country: string;

  @ApiProperty({ description: 'Địa chỉ giao hàng', example: '123 ABC Street' })
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;

  @ApiProperty({ description: 'Tổng số tiền đơn hàng', example: 120000 })
  @IsNumber({}, { message: OrderErrorMessage.AMOUNT_MUST_BE_INTEGER })
  @IsNotEmpty({ message: OrderErrorMessage.AMOUNT_SHOULD_NOT_BE_EMPTY })
  @Min(1, { message: OrderErrorMessage.AMOUNT_MUST_BE_A_POSITIVE_NUMBER })
  amount: number;

  @ApiProperty({
    description: 'Mã bưu điện',
    example: 700000,
    type: Number,
  })
  @IsString({ message: OrderErrorMessage.ZIP_CODE_MUST_BE_STRING })
  @IsNotEmpty({ message: OrderErrorMessage.ZIP_CODE_REQUIRED })
  zipCode: string;

  @ApiProperty({
    description: 'ID giao dịch PayPal',
    example: '5O190127TN364715T',
  })
  @IsString({ message: OrderErrorMessage.PAYPAL_ID_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  @IsOptional()
  paypalOrderId?: string;
}
