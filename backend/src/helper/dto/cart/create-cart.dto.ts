import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ErrorMessage } from 'src/helper/message/error-message';

export class CartCreateDTO {
  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @IsNotEmpty()
  @Min(1)
  @ApiProperty()
  userId: number;
}
