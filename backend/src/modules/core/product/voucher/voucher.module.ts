import { VoucherController } from '@core-modules/product/voucher/voucher.controller';
import { VoucherService } from '@core-modules/product/voucher/voucher.service';
import { UtilityModule } from '@helper-modules/services/utility.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UtilityModule],
  controllers: [VoucherController],
  providers: [VoucherService],
})
export class VoucherModule {}
