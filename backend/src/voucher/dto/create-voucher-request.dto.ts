import { ApiProperty } from '@nestjs/swagger';
import { VoucherErrorMessage, VoucherStatus } from '@voucher';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateVoucherRequestDto {
  @ApiProperty()
  @IsString({ message: VoucherErrorMessage.VOUCHER_CODE_MUST_BE_STRING })
  @IsNotEmpty({ message: VoucherErrorMessage.VOUCHER_CODE_SHOULD_NOT_BE_EMPTY })
  voucherCode: string;

  @ApiProperty()
  @IsEnum(VoucherStatus, {
    message: VoucherErrorMessage.VOUCHER_STATUS_INVALID,
  })
  @IsNotEmpty({ message: VoucherErrorMessage.VOUCHER_CODE_SHOULD_NOT_BE_EMPTY })
  status: VoucherStatus;

  @ApiProperty()
  @IsInt({ message: VoucherErrorMessage.AMOUNT_MUST_BE_INTEGER })
  @IsNotEmpty({
    message: VoucherErrorMessage.VOUCHER_DISCOUNT_MUST_NOT_BE_EMPTY,
  })
  @Min(0, {
    message: VoucherErrorMessage.VOUCHER_DISCOUNT_MUST_BE_POSITIVE_NUMBER,
  })
  discount: number;

  @ApiProperty()
  @IsDate({ message: VoucherErrorMessage.EXPIRE_AT_MUST_VALID })
  @IsNotEmpty({ message: VoucherErrorMessage.EXPIRE_AT_SHOULD_NOT_BE_EMPTY })
  expireAt: Date;
}
