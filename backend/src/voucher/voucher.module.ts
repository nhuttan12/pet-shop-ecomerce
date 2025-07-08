import { UtilityModule } from '@services/utility.module';
import { Voucher } from './entities/vouchers.entity';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UtilityModule, TypeOrmModule.forFeature([Voucher])],
  controllers: [VoucherController],
  providers: [VoucherService],
})
export class VoucherModule {}
