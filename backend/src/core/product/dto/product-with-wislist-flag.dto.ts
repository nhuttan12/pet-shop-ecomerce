import { Product } from '@product/entites/products.entity';

export class ProductWithWishlistFlag extends Product {
  isInWishlist: boolean;
}
