import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { WishlistMappingResponseDto } from '@wishlist/dto/wishlist-response.dto';
import { WishlistMapping } from '@wishlist/entities/wishlist-mapping.entity';

@Injectable()
export class WishlistMappingProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      this.wishlistMappingToWishlistMappingResponse(mapper);
    };
  }

  private wishlistMappingToWishlistMappingResponse(mapper: Mapper) {
    createMap(
      mapper,
      WishlistMapping,
      WishlistMappingResponseDto,
      forMember(
        (dest: WishlistMappingResponseDto) => dest.userID,
        mapFrom((src: WishlistMapping) => src.wishlist.user.id),
      ),
      forMember(
        (dest: WishlistMappingResponseDto) => dest.productName,
        mapFrom((src: WishlistMapping) => src.product.name),
      ),
      forMember(
        (dest: WishlistMappingResponseDto) => dest.productPrice,
        mapFrom((src: WishlistMapping) => src.product.price),
      ),
      forMember(
        (dest: WishlistMappingResponseDto) => dest.brandName,
        mapFrom((src: WishlistMapping) => src.product.brand.name),
      ),
      forMember(
        (dest: WishlistMappingResponseDto) => dest.categoryName,
        mapFrom(
          (src: WishlistMapping) =>
            src.product.categoriesMapping.map((cm) => cm.category.name) ?? [],
        ),
      ),
      forMember(
        (dest: WishlistMappingResponseDto) => dest.stock,
        mapFrom((src: WishlistMapping) => src.product.stocking),
      ),
    );
  }
}
