import { ProductStatus } from '../../../enum/product-status.enum';

export interface WishlistMappingResponseDto {
  id: number;
  userID: number;
  productName: string;
  productPrice: number;
  brandName: string;
  categoryName: string;
  status: ProductStatus;
  thumbnailUrl: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
