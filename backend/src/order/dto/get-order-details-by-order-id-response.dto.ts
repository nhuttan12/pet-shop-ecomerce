import { Expose } from 'class-transformer';

export class GetOrderDetailsByOrderIdResponseDto {
  @Expose()
  id: number;

  @Expose()
  orderId: number;

  @Expose()
  productname: string;

  @Expose()
  imageUrl: string;

  @Expose()
  quantity: number;

  @Expose()
  price: number;

  @Expose()
  totalPrice: number;
}
