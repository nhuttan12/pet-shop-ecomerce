import { Expose } from 'class-transformer';
import { AutoMap } from '@automapper/classes';

export class GetOrderDetailsByOrderIDResponseDto {
  @Expose()
  @AutoMap()
  id: number;

  @Expose()
  @AutoMap()
  orderID: number;

  @Expose()
  @AutoMap()
  productname: string;

  @Expose()
  @AutoMap()
  imageUrl: string;

  @Expose()
  @AutoMap()
  quantity: number;

  @Expose()
  @AutoMap()
  price: number;

  @Expose()
  @AutoMap()
  totalPrice: number;
}
