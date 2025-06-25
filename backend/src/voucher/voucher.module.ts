import { UtilityModule } from '@common';
import { Module } from '@nestjs/common';
import { VoucherController, VoucherService } from '@voucher';

@Module({
  imports: [UtilityModule],
  controllers: [VoucherController],
  providers: [VoucherService],
})
export class VoucherModule {}
