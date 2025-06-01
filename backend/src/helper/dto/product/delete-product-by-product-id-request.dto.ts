import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { ErrorMessage } from 'src/helper/message/error-message';
import { Property } from 'src/helper/message/property';

export class DeleteProductByProductIdRequestDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @Min(1, {
    message: `${Property.ID} ${ErrorMessage.SHOULD_NOT_BE_A_NEGATIVE_NUMBER}`,
  })
  productId: number;
}
