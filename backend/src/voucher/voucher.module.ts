import { UtilityModule } from '@services/utility.module';
import { Voucher } from './entities/vouchers.entity';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoucherRepository } from '@voucher/repositories/voucher.repository';

@Module({
  imports: [UtilityModule, TypeOrmModule.forFeature([Voucher])],
  controllers: [VoucherController],
  providers: [VoucherService, VoucherRepository],
  exports: [VoucherService],
})
export class VoucherModule {}
