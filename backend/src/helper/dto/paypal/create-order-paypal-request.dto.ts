import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { OrderErrorMessage } from 'src/helper/message/order-error-message';

export class CreateOrderDto {
  @IsNotEmpty({ message: OrderErrorMessage.ORDER_ID_SHOULD_NOT_BE_EMPTY })
  @IsNumber({}, { message: OrderErrorMessage.AMOUNT_MUST_BE_INTEGER })
  @Min(1, { message: OrderErrorMessage.AMOUNT_MUST_BE_A_POSITIVE_NUMBER })
  amount: number;
}
