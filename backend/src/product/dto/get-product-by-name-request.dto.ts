import { ErrorMessage } from '@messages/error.messages';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductErrorMessage } from '@product/messages/product.error-messages';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  Validate,
} from 'class-validator';
import { NotUrlValidator } from 'common/class-validator-contraint/not-url.validator';

export class GetProductByNameRequest {
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

  @IsString({ message: ProductErrorMessage.NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
