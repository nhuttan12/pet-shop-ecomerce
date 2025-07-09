import { ErrorMessage } from '@messages/error.messages';
import { ApiProperty } from '@nestjs/swagger';
import { OrderErrorMessage } from '@order/messages/order.error-messages';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CancelOrderRequestDto {
  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @IsNotEmpty({ message: OrderErrorMessage.ORDER_ID_IS_NOT_EMPTY })
  @Min(1, {
    message: OrderErrorMessage.ORDER_ID_MUST_BE_A_POSITIVE_NUMBER,
  })
  @ApiProperty()
  orderId: number;
}
