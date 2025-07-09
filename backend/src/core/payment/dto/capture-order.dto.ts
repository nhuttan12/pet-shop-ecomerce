import { ApiProperty } from '@nestjs/swagger';
import { PaymentErrorMessages } from '@payment/messages/payment.error-messages';
import { IsNotEmpty, IsString } from 'class-validator';

export class CaptureOrderDto {
  @ApiProperty({
    description:
      'Token được trả về từ PayPal sau khi người dùng chấp nhận thanh toán',
    example: 'EC-2A12345678901234L',
  })
  @IsString({ message: PaymentErrorMessages.TOKEN_MUST_BE_STRING })
  @IsNotEmpty({ message: PaymentErrorMessages.TOKEN_IS_REQUIRED })
  token: string;
}
