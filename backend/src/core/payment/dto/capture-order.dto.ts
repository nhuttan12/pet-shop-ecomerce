import { PaymentErrorMessages } from '@payment/messages/payment.error-messages';
import { IsNotEmpty, IsString } from 'class-validator';

export class CaptureOrderDto {
  @IsString({ message: PaymentErrorMessages.TOKEN_MUST_BE_STRING })
  @IsNotEmpty({ message: PaymentErrorMessages.TOKEN_IS_REQUIRED })
  token: string;
}
