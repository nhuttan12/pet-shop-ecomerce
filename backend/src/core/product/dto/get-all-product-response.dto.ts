import { Expose } from 'class-transformer';

export class GetAllProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  brandName: string;

  @Expose()
  categoryName: string;

  @Expose()
  status: string;

  @Expose()
  thumbnailUrl: string;

  @Expose()
  stock: number;
}
