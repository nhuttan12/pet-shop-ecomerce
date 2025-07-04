import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetProductDetailResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  price: number;

  @Expose()
  @ApiProperty()
  brandName: string;

  @Expose()
  @ApiProperty({ type: [String] })
  categoryNames: string[];

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty()
  thumbnailUrl: string;

  @Expose()
  @ApiProperty()
  imagesUrl: string[];

  @Expose()
  @ApiProperty()
  starRated: number;

  @Expose()
  @ApiProperty()
  stock: number;
}
