import { IsEnum, IsNotEmpty, Validate } from 'class-validator';
import { OrderStatus } from '@order/enums/order-status.enum';
import { OrderErrorMessage } from '@order/messages/order.error-messages';
import { NotUrlValidator } from '@class-validator/not-url.validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindOrderListByOrderStatusRequestDto {
  @ApiProperty({
    description: 'Trạng thái đơn hàng để lọc',
    enum: OrderStatus,
    enumName: 'OrderStatus',
    example: OrderStatus.PENDING,
  })
  @IsEnum(OrderStatus, { message: OrderErrorMessage.ORDER_STATUS_NOT_FOUND })
  @IsNotEmpty({ message: OrderErrorMessage.ORDER_STATUS_IS_NOT_EMPTY })
  @Validate(NotUrlValidator)
  status: OrderStatus;
}
