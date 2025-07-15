import { CartModule } from '@cart/cart.module';
import { UtilityModule } from '@services/utility.module';
import { Order } from './entites/orders.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from '@order/repositories/order.repository';
import { OrderDetailRepository } from '@order/repositories/order-detail.repository';
import { OrderDetail } from '@order/entites/order-details.entity';
import { OrderDetailService } from '@order/order-detail.service';
import { ImageModule } from '@images/image.module';
import { MapperModule } from 'common/mapper/mapper.module';

@Module({
  imports: [
    MapperModule,
    UtilityModule,
    CartModule,
    ImageModule,
    TypeOrmModule.forFeature([Order, OrderDetail]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderDetailService,
    OrderRepository,
    OrderDetailRepository,
  ],
})
export class OrderModule {}
