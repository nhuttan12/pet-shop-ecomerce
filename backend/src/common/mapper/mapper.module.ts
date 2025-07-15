import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { OrderDetailProfile } from 'common/mapper/order/order-detail.profile';
import { OrderProfile } from 'common/mapper/order/order.profile';
import { ProductProfile } from 'common/mapper/product/product.profile';
import { WishlistMappingProfile } from 'common/mapper/wishlist/wishlist-mapping.profile';

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  providers: [
    OrderDetailProfile,
    OrderProfile,
    WishlistMappingProfile,
    ProductProfile,
  ],
  exports: [AutomapperModule],
})
export class MapperModule {}
