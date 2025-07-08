import { Module } from '@nestjs/common';
import { UtilityModule } from '@services/utility.module';
import { WishListMappingService } from '@wishlist/wishlist-mapping.service';
import { WishlistController } from '@wishlist/wishlist.controller';
import { WishlistService } from '@wishlist/wishlist.service';

@Module({
  imports: [UtilityModule],
  controllers: [WishlistController],
  providers: [WishlistService, WishListMappingService],
})
export class WishlistModule {}
