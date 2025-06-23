import { StripeInterval } from '@enum/stripe-interval.enum';
import { StripeErrorMessage } from '@message/srtipe-message';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateStripePriceDto {
  @IsString({ message: StripeErrorMessage.STRIPE_PRODUCT_ID_MUST_BE_STRING })
  stripeProductId: string;

  @IsString({ message: StripeErrorMessage.OLD_PRICE_ID_MUST_BE_STRING })
  oldPriceId: string;

  @IsNumber({}, { message: StripeErrorMessage.NEW_AMOUNT_MUST_BE_NUMBER })
  newAmount: number;

  @IsOptional()
  @IsString({ message: StripeErrorMessage.CURRENCY_MUST_BE_STRING })
  currency: string = 'vnd';

  @IsOptional()
  @IsEnum(StripeInterval, {
    message: StripeErrorMessage.INTERVAL_MUST_BE_ENUM,
  })
  interval: StripeInterval = StripeInterval.MONTH;
}
