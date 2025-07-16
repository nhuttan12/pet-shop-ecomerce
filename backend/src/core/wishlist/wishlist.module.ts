import { ImageModule } from '@images/image.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilityModule } from '@services/utility.module';
import { WishlistMapping } from '@wishlist/entities/wishlist-mapping.entity';
import { Wishlist } from '@wishlist/entities/wishlists.entity';
import { WishlistMappingRepository } from '@wishlist/repositories/wishlist-mapping.repository';
import { WishlistRepository } from '@wishlist/repositories/wishlist.repository';
import { WishListMappingService } from '@wishlist/wishlist-mapping.service';
import { WishlistController } from '@wishlist/wishlist.controller';
import { WishlistService } from '@wishlist/wishlist.service';
import { MapperModule } from 'common/mapper/mapper.module';

@Module({
  imports: [
    MapperModule,
    ImageModule,
    UtilityModule,
    TypeOrmModule.forFeature([Wishlist, WishlistMapping]),
  ],
  controllers: [WishlistController],
  exports: [WishlistService, WishListMappingService],
  providers: [
    WishlistService,
    WishListMappingService,
    WishlistRepository,
    WishlistMappingRepository,
  ],
})
export class WishlistModule {}
