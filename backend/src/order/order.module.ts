import { CartModule } from '@cart/cart.module';
import { UtilityModule } from '@services/utility.module';
import { Order } from './entites/orders.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UtilityModule, CartModule, TypeOrmModule.forFeature([Order])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
