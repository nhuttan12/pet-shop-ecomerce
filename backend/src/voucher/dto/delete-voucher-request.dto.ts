import { ApiProperty } from '@nestjs/swagger';
import { VoucherErrorMessage } from '@voucher/messages/voucher.error-messages';
import { Min, IsInt } from 'class-validator';

export class DeleteVoucherRequestDto {
  @ApiProperty()
  @Min(1, { message: VoucherErrorMessage.VOUCHER_ID_MUST_BE_POSITIVE_NUMBER })
  @IsInt({ message: VoucherErrorMessage.VOUCHER_ID_MUST_BE_INTEGER })
  voucherId: number;
}
