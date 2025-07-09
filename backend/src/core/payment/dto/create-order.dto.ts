import { PaymentErrorMessages } from '@payment/messages/payment.error-messages';
import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsNumber({}, { message: PaymentErrorMessages.AMOUNT_MUST_BE_NUMBER })
  amount: number;

  @IsString({ message: PaymentErrorMessages.CURRENCY_MUST_BE_STRING })
  @IsNotEmpty({ message: PaymentErrorMessages.CURRENCY_IS_REQUIRED })
  currency: string; // e.g. 'USD', 'EUR'

  @IsString({ message: PaymentErrorMessages.PARAM_IS_NOT_VALID })
  @IsNotEmpty({ message: PaymentErrorMessages.URL_IS_REQUIRED })
  return_url: string;

  @IsString({ message: PaymentErrorMessages.PARAM_IS_NOT_VALID })
  @IsNotEmpty({ message: PaymentErrorMessages.URL_IS_REQUIRED })
  cancel_url: string;

  @IsString()
  @IsOptional()
  description?: string;
}
