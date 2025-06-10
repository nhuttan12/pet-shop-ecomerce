import { Module } from '@nestjs/common';
import { WishlistController } from '@core-modules/product/wishlist/wishlist.controller';
import { UtilityModule } from '@helper-modules/services/utility.module';
import { WishlistService } from './wishlist.service';

@Module({
  imports: [UtilityModule],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
