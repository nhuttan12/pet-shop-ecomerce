import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { ErrorMessage } from 'src/helper/message/error-message';
import { Property } from 'src/helper/message/property';

export class GetProductDetailRequestDto {
  @Type(() => Number)
  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @Min(1, {
    message: `${Property.PRODUCT} ${Property.ID} ${ErrorMessage.SHOULD_NOT_BE_A_NEGATIVE_NUMBER}`,
  })
  @ApiProperty()
  productId: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: ErrorMessage.PAGE_MUST_BE_INTETER })
  @Min(1, { message: ErrorMessage.PAGE_SHOULD_NOT_A_NEGATIVE_NUMBER })
  page: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: ErrorMessage.LIMIT_MUST_BE_INTETER })
  @Min(10, { message: ErrorMessage.LIMIT_HAVE_AT_LEAST_10 })
  limit: number;
}
