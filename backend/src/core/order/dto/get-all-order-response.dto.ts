import { Expose } from 'class-transformer';
import { AutoMap } from '@automapper/classes';

export class GetAllOrdersResponseDto {
  @Expose()
  @AutoMap()
  id: number;

  @Expose()
  @AutoMap()
  userID: number;

  @Expose()
  @AutoMap()
  totalPrice: number;

  @Expose()
  @AutoMap()
  paymentMethod: string;

  @Expose()
  @AutoMap()
  shippingMethod: string;

  @Expose()
  @AutoMap()
  status: string;

  @Expose()
  @AutoMap()
  createdAt: Date;

  @Expose()
  @AutoMap()
  updatedAt: Date;
}
