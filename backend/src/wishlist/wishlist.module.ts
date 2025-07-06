import { Module } from '@nestjs/common';
import {
  WishlistController,
  WishListMappingService,
  WishlistService,
} from '@wishlist';
import { UtilityModule } from '@common';

@Module({
  imports: [UtilityModule],
  controllers: [WishlistController],
  providers: [WishlistService, WishListMappingService],
})
export class WishlistModule {}
