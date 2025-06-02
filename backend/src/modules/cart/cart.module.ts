import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { UtilityModule } from 'src/helper/services/utility.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [UtilityModule, ProductModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [],
})
export class CartModule {}
