import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { OrderDetailResponseDto } from '@order/dto/order-detail-response.dto';
import { OrderDetail } from '@order/entites/order-details.entity';

@Injectable()
export class OrderDetailProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      this.orderDetailToOrderDetailResponse(mapper);
    };
  }

  private orderDetailToOrderDetailResponse(mapper: Mapper) {
    createMap(
      mapper,
      OrderDetail,
      OrderDetailResponseDto,
      forMember(
        (dest: OrderDetailResponseDto) => dest.orderID,
        mapFrom((src: OrderDetail) => src.order.id),
      ),
      forMember(
        (dest: OrderDetailResponseDto) => dest.productID,
        mapFrom((src: OrderDetail) => src.product.id),
      ),
    );
  }
}
