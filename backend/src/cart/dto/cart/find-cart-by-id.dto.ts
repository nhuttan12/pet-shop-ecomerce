import { ErrorMessage } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class FindCartById {
  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  id: number;
}
