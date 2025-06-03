import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ErrorMessage } from 'src/helper/message/error-message';

export class GetOrderDetailsByOrderIdRequestDto {
  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  orderId: number;
}
