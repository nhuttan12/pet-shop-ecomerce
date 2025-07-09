import { CartDetailStatus } from '@cart/enums/cart-detail-status.enum';
import { ProductStatus } from '@product/enums/product-status.enum';
import { Expose } from 'class-transformer';

export class CartDetailResponse {
  @Expose()
  cartDetailID: number;

  @Expose()
  quantity: number;

  @Expose()
  price: number;

  @Expose()
  cartDetailStatus: CartDetailStatus;

  @Expose()
  productID: number;

  @Expose()
  productName: string;

  @Expose()
  productPrice: number;

  @Expose()
  productStocking: number;

  @Expose()
  productStatus: ProductStatus;

  @Expose()
  imageUrl: string | null;
}
