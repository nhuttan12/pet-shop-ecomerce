import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { OrderResponseDto } from '@order/dto/order-response.dto';
import { Order } from '@order/entites/orders.entity';

@Injectable()
export class OrderProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      this.orderToOrderResponse(mapper);
    };
  }

  private orderToOrderResponse(mapper: Mapper) {
    createMap(
      mapper,
      Order,
      OrderResponseDto,
      forMember(
        (dest: OrderResponseDto) => dest.userID,
        mapFrom((src: Order) => src.user.id),
      ),
      forMember(
        (dest: OrderResponseDto) => dest.voucherID,
        mapFrom((src: Order) => src.voucher?.id),
      ),
    );
  }
}
