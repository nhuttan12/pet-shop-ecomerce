import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ErrorMessage } from '@message/error-message';
import { Property } from '@message/property';

export class CancelOrderRequestDto {
  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @IsNotEmpty({ message: `${Property.ID} ${ErrorMessage.IS_NOT_EMPTY}` })
  @Min(1, {
    message: `${Property.ID} ${ErrorMessage.SHOULD_NOT_BE_A_NEGATIVE_NUMBER}`,
  })
  @ApiProperty()
  orderId: number;
}
