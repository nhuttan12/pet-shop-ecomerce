import { CartController } from '@core-modules/cart/cart.controller';
import { CartService } from '@core-modules/cart/cart.service';
import { ProductModule } from '@core-modules/product/product/product.module';
import { UtilityModule } from '@helper-modules/services/utility.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UtilityModule, ProductModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [],
})
export class CartModule {}
