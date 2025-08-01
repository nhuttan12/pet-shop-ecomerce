import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { CartDetailResponse } from '@cart/dto/cart-detail/cart-detail-response.dto';
import { CartDetail } from '@cart/entities/cart-details.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CartDetailProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      this.cartDetailToCartDetailResponse(mapper);
    };
  }

  private cartDetailToCartDetailResponse(mapper: Mapper) {
    createMap(
      mapper,
      CartDetail,
      CartDetailResponse,
      forMember(
        (dest: CartDetailResponse) => dest.cartDetailID,
        mapFrom((src: CartDetail) => src.id),
      ),
      forMember(
        (dest: CartDetailResponse) => dest.productID,
        mapFrom((src: CartDetail) => src.product.id),
      ),
      forMember(
        (dest: CartDetailResponse) => dest.productName,
        mapFrom((src: CartDetail) => src.product.name),
      ),
      forMember(
        (dest: CartDetailResponse) => dest.productPrice,
        mapFrom((src: CartDetail) => src.product.price),
      ),
      forMember(
        (dest: CartDetailResponse) => dest.productStocking,
        mapFrom((src: CartDetail) => src.product.stocking),
      ),
      forMember(
        (dest: CartDetailResponse) => dest.cartDetailStatus,
        mapFrom((src: CartDetail) => src.status),
      ),
      forMember(
        (dest: CartDetailResponse) => dest.productStatus,
        mapFrom((src: CartDetail) => src.product.status),
      ),
    );
  }
}
