import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderErrorMessage } from '@order/messages/order.error-messages';

export class GetOrderListByOrderIdRequestDto {
  @IsInt({ message: OrderErrorMessage.ID_MUST_BE_INTEGER })
  @Min(1, { message: OrderErrorMessage.ID_MUST_BE_A_POSITIVE_NUMBER })
  @IsNotEmpty({ message: OrderErrorMessage.ORDER_ID_IS_NOT_EMPTY })
  @ApiProperty({
    description: 'The ID of the order to retrieve details for',
    example: 123,
    minimum: 1,
    type: Number,
  })
  orderID: number;
}
