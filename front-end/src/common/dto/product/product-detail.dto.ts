export interface GetProductDetailResponseDto {
  id: number;
  name: string;
  description: string;
  price: number;
  brandName: string;
  categoryNames: string[];
  status: string;
  thumbnailUrl: string;
  imagesUrl: string[];
  starRated: number;
  stock: number;
}
