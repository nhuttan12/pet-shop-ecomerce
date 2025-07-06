import { CartController, CartDetailService, CartService } from '@cart';
import { UtilityModule } from '@common';
import { Module } from '@nestjs/common';
import { ProductModule } from '@product';

@Module({
  imports: [UtilityModule, ProductModule],
  controllers: [CartController],
  providers: [CartService, CartDetailService],
  exports: [],
})
export class CartModule {}
