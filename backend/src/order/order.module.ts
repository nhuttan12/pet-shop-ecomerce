import { OrderController } from '@core-modules/order/order.controller';
import { OrderService } from '@core-modules/order/order.service';
import { UtilityModule } from '@helper-modules/services/utility.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UtilityModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
