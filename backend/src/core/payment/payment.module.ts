import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { AppConfigModule } from '@config/app-config.module';
import { OrderModule } from '@order/order.module';
import { UtilityModule } from '@services/utility.module';

@Module({
  imports: [AppConfigModule, OrderModule, UtilityModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
