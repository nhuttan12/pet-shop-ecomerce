import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
  mapWith,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { WishlistMappingResponseDto } from '@wishlist/dto/wishlist-mapping-response.dto';
import { WishlistResponseDto } from '@wishlist/dto/wishlist-response.dto';
import { WishlistMapping } from '@wishlist/entities/wishlist-mapping.entity';
import { Wishlist } from '@wishlist/entities/wishlists.entity';

@Injectable()
export class WishlistProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      this.wishlistToWishlistResponse(mapper);
    };
  }

  private wishlistToWishlistResponse(mapper: Mapper) {
    createMap(
      mapper,
      Wishlist,
      WishlistResponseDto,
      forMember(
        (dest: WishlistResponseDto) => dest.userID,
        mapFrom((src: Wishlist) => src.user.id),
      ),
      forMember(
        (dest: WishlistResponseDto) => dest.wishlistMappings,
        mapWith(
          WishlistMappingResponseDto,
          WishlistMapping,
          (src: Wishlist) => src.wishlistMappings,
        ),
      ),
    );
  }
}
