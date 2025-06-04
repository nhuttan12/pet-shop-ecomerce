import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { VoucherErrorMessage } from 'src/helper/message/voucher-error-message';

export class DeleteVoucherRequestDto {
  @ApiProperty()
  @Min(1, { message: VoucherErrorMessage.VOUCHER_ID_MUST_BE_POSITIVE_NUMBER })
  @IsInt({ message: VoucherErrorMessage.VOUCHER_ID_MUST_BE_INTEGER })
  voucherId: number;
}
