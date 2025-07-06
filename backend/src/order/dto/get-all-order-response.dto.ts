import { Expose } from 'class-transformer';

export class GetAllOrdersResponseDto {
  @Expose()
  id: number;

  @Expose()
  userID: number;

  @Expose()
  totalPrice: number;

  @Expose()
  paymentMethod: string;

  @Expose()
  shippingMethod: string;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
