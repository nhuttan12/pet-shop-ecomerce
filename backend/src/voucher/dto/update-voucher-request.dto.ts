import { VoucherStatus } from '@voucher';

export class UpdateVoucherRequestDto {
  voucherId: number;
  voucherCode: string;
  status: VoucherStatus;
  discount: number;
  expireAt: Date;
}
