import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ErrorMessage } from 'common/messages';

export class GetImageDTO {
  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @IsNotEmpty()
  @Min(1)
  @ApiProperty()
  id: number;
}
