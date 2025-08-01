import { CartDetailService } from '@cart/cart-detail.service';
import { CartController } from '@cart/cart.controller';
import { CartService } from '@cart/cart.service';
import { CartDetail } from '@cart/entities/cart-details.entity';
import { Cart } from '@cart/entities/carts.entity';
import { CartDetailRepository } from '@cart/repositories/cart-detail.repository';
import { CartRepository } from '@cart/repositories/cart.repository';
import { ImageModule } from '@images/image.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '@product/product.module';
import { UtilityModule } from '@services/utility.module';
import { MapperModule } from 'common/mapper/mapper.module';

@Module({
  imports: [
    MapperModule,
    UtilityModule,
    ProductModule,
    ImageModule,
    TypeOrmModule.forFeature([CartDetail, Cart]),
  ],
  controllers: [CartController],
  providers: [
    CartService,
    CartDetailService,
    CartRepository,
    CartDetailRepository,
  ],
  exports: [CartService, CartDetailService],
})
export class CartModule {}
