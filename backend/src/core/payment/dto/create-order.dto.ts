import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentErrorMessages } from '@payment/messages/payment.error-messages';
import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Số tiền của đơn hàng',
    example: 49.99,
  })
  @IsNumber({}, { message: PaymentErrorMessages.AMOUNT_MUST_BE_NUMBER })
  amount: number;

  @ApiProperty({
    description:
      'Đơn vị tiền tệ, viết hoa theo chuẩn quốc tế (ví dụ: USD, EUR)',
    example: 'USD',
  })
  @IsString({ message: PaymentErrorMessages.CURRENCY_MUST_BE_STRING })
  @IsNotEmpty({ message: PaymentErrorMessages.CURRENCY_IS_REQUIRED })
  currency: string;

  @ApiProperty({
    description:
      'URL người dùng sẽ được chuyển đến sau khi thanh toán thành công',
    example: 'https://example.com/payment-success',
  })
  @IsString({ message: PaymentErrorMessages.PARAM_IS_NOT_VALID })
  @IsNotEmpty({ message: PaymentErrorMessages.URL_IS_REQUIRED })
  return_url: string;

  @ApiProperty({
    description: 'URL người dùng sẽ được chuyển đến nếu huỷ thanh toán',
    example: 'https://example.com/payment-cancel',
  })
  @IsString({ message: PaymentErrorMessages.PARAM_IS_NOT_VALID })
  @IsNotEmpty({ message: PaymentErrorMessages.URL_IS_REQUIRED })
  cancel_url: string;

  @ApiPropertyOptional({
    description: 'Mô tả ngắn gọn về đơn hàng',
    example: 'Thanh toán đơn hàng giày thể thao Adidas',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
