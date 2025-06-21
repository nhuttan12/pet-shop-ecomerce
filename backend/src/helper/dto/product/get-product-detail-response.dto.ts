export class GetProductDetailResponseDto {
  id: number;
  name: string;
  description: string;
  price: number;
  brandName: string;
  categoryName: string;
  status: string;
  thumbnailUrl: string;
  imagesUrl: string[];
  starRated: number;
  stock: number;
}
