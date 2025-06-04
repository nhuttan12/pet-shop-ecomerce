import { VoucherStatus } from 'src/helper/enum/status/vouchers-status.enum';

export interface UpdateVoucherRequestDto {
  voucherId: number;
  voucherCode: string;
  status: VoucherStatus;
  discount: number;
  expireAt: Date;
}
