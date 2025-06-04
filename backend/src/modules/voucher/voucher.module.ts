import { Module } from '@nestjs/common';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { UtilityModule } from 'src/helper/services/utility.module';

@Module({
  imports: [UtilityModule],
  controllers: [VoucherController],
  providers: [VoucherService],
})
export class VoucherModule {}
