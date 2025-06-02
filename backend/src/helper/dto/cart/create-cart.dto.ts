import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ErrorMessage } from 'src/helper/message/error-message';
import { Property } from 'src/helper/message/property';

export class CartCreateDTO {
  @ApiProperty()
  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @IsNotEmpty({ message: `${Property.ID} ${ErrorMessage.IS_NOT_EMPTY}` })
  @Min(1, {
    message: `${Property.ID} ${ErrorMessage.SHOULD_NOT_BE_A_NEGATIVE_NUMBER}`,
  })
  productId: number;

  @ApiProperty()
  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @IsNotEmpty({ message: `${Property.ID} ${ErrorMessage.IS_NOT_EMPTY}` })
  @Min(1, {
    message: `${Property.ID} ${ErrorMessage.SHOULD_NOT_BE_A_NEGATIVE_NUMBER}`,
  })
  quantity: number;
}
