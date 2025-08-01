export interface GetAllProductResponseDto {
  id: number;
  name: string;
  description: string;
  price: number;
  brandName: string;
  categoryName: string;
  status: string;
  thumbnailUrl: string;
  isInWishlist?: boolean;
  stock: number;
}
