import { AutoMap } from '@automapper/classes';
import { ProductStatus } from '@product/enums/product-status.enum';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class GetAllProductResponseDto {
  @Expose()
  @AutoMap()
  id: number;

  @Expose()
  @AutoMap()
  name: string;

  @Expose()
  @AutoMap()
  description: string;

  @Expose()
  @AutoMap()
  price: number;

  @Expose()
  @AutoMap()
  brandName: string;

  @Expose()
  @AutoMap()
  categoryName: string[];

  @Expose()
  @AutoMap()
  status: ProductStatus;

  @Expose()
  @AutoMap()
  thumbnailUrl: string;

  @Expose()
  @AutoMap()
  @IsOptional()
  isInWishlist?: boolean;

  @Expose()
  @AutoMap()
  stock: number;
}
