import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
  mapWith,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { CartDetailResponse } from '@cart/dto/cart-detail/cart-detail-response.dto';
import { CartResponseDto } from '@cart/dto/cart/cart-response.dto';
import { CartDetail } from '@cart/entities/cart-details.entity';
import { Cart } from '@cart/entities/carts.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CartProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      this.cartToCartResponse(mapper);
    };
  }

  private cartToCartResponse(mapper: Mapper) {
    createMap(
      mapper,
      Cart,
      CartResponseDto,
      forMember(
        (dest: CartResponseDto) => dest.id,
        mapFrom((src: Cart) => src.id),
      ),
      forMember(
        (dest: CartResponseDto) => dest.userID,
        mapFrom((src: Cart) => src.user.id),
      ),
      forMember(
        (dest: CartResponseDto) => dest.cartDetails,
        mapWith(CartDetailResponse, CartDetail, (src: Cart) => src.cartDetails),
      ),
    );
  }
}
