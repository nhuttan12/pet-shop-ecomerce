import { ErrorMessage } from '@messages/error.messages';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsNotEmpty } from 'class-validator';

export class GetOrderDetailsByOrderIDRequestDto {
  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  orderID: number;
}
