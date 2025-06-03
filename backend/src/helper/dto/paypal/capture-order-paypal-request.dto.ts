import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { OrderErrorMessage } from 'src/helper/message/order-error-message';

export class CaptureOrderDto {
  @IsNotEmpty({ message: OrderErrorMessage.ORDER_ID_SHOULD_NOT_BE_EMPTY })
  @IsInt({ message: OrderErrorMessage.ID_MUST_BE_INTEGER })
  @Min(1, { message: OrderErrorMessage.ORDER_ID_MUST_BE_A_POSITIVE_NUMBER })
  @ApiProperty()
  orderId: number;
}
