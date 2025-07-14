import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { OrderDetailProfile } from 'common/mapper/order/order-detail.profile';
import { OrderProfile } from 'common/mapper/order/order.profile';

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  providers: [OrderDetailProfile, OrderProfile],
  exports: [AutomapperModule],
})
export class MapperModule {}
