import { Module } from '@nestjs/common';
import { WishlistController, WishlistService } from '@wishlist';
import { UtilityModule } from '@common';

@Module({
  imports: [UtilityModule],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
