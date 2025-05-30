import { CartDetailStatus } from 'src/helper/enum/status/cart-detail-status.enum';
import { ProductStatus } from 'src/helper/enum/status/product-status.enum';

export interface CartDetailResponse {
  cartDetailId: number;
  quantity: number;
  price: number;
  cartDetailStatus: CartDetailStatus;
  productId: number;
  productName: string;
  productPrice: number;
  productStocking: number;
  productStatus: ProductStatus;
  imageUrl: string | null;
}
