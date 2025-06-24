import { Module } from '@nestjs/common';
import { WishlistController } from '@wishlist/wishlist.controller';
import { UtilityModule } from '@services/utility.module';
import { WishlistService } from './wishlist.service';

@Module({
  imports: [UtilityModule],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
