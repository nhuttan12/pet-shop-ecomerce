import { NotUrlValidator } from '@class-validator/not-url.validator';
import { ErrorMessage } from '@messages/error.messages';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { VoucherErrorMessage } from '@voucher/messages/voucher.error-messages';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  Validate,
  IsNotEmpty,
} from 'class-validator';

export class FindVoucherByCodeRequestDto {
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

  @IsString({ message: VoucherErrorMessage.VOUCHER_CODE_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  @IsNotEmpty()
  @ApiProperty()
  voucherCode: string;
}
