import { AutoMap } from '@automapper/classes';
import { CartDetailStatus } from '@cart/enums/cart-detail-status.enum';
import { ProductStatus } from '@product/enums/product-status.enum';
import { Expose } from 'class-transformer';

export class CartDetailResponse {
  @Expose()
  @AutoMap()
  cartDetailID: number;

  @Expose()
  @AutoMap()
  quantity: number;

  @Expose()
  @AutoMap()
  price: number;

  @Expose()
  @AutoMap()
  cartDetailStatus: CartDetailStatus;

  @Expose()
  @AutoMap()
  productID: number;

  @Expose()
  @AutoMap()
  productName: string;

  @Expose()
  @AutoMap()
  productPrice: number;

  @Expose()
  @AutoMap()
  productStocking: number;

  @Expose()
  @AutoMap()
  productStatus: ProductStatus;

  @Expose()
  @AutoMap()
  imageUrl: string | null;
}
