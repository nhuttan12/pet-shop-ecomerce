import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { AppConfigModule } from '@config/app-config.module';
import { OrderModule } from '@order/order.module';

@Module({
  imports: [AppConfigModule, OrderModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
