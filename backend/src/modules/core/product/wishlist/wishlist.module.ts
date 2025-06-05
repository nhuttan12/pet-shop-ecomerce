import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { UtilityModule } from 'src/modules/helper/services/utility.module';

@Module({
  imports: [UtilityModule],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
