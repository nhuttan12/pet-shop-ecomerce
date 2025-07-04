import { ErrorMessage } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { ProductErrorMessage } from 'product/messages';

export class DeleteProductByProductIdRequestDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @Min(1, {
    message: ProductErrorMessage.PRODUCT_ID_MUST_BE_POSITIVE,
  })
  productId: number;
}
