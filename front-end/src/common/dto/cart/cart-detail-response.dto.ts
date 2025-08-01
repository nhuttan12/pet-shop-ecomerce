import { CartDetailStatus } from '../../enum/cart/cart-detail-status.enum';
import { ProductStatus } from '../../enum/product-status.enum';

export interface CartDetailResponse {
  cartDetailID: number;
  quantity: number;
  price: number;
  cartDetailStatus: CartDetailStatus;
  productID: number;
  productName: string;
  productPrice: number;
  productStocking: number;
  productStatus: ProductStatus;
  imageUrl: string | null;
}
