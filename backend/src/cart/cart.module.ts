import { CartDetailService } from '@cart/cart-detail.service';
import { CartController } from '@cart/cart.controller';
import { CartService } from '@cart/cart.service';
import { Module } from '@nestjs/common';
import { ProductModule } from '@product/product.module';
import { UtilityModule } from '@services/utility.module';

@Module({
  imports: [UtilityModule, ProductModule],
  controllers: [CartController],
  providers: [CartService, CartDetailService],
  exports: [],
})
export class CartModule {}
