import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetProductDetailResponseDto {
  @Expose()
  @ApiProperty()
  @AutoMap()
  id: number;

  @Expose()
  @ApiProperty()
  @AutoMap()
  name: string;

  @Expose()
  @ApiProperty()
  @AutoMap()
  description: string;

  @Expose()
  @ApiProperty()
  @AutoMap()
  price: number;

  @Expose()
  @ApiProperty()
  @AutoMap()
  brandName: string;

  @Expose()
  @ApiProperty({ type: [String] })
  @AutoMap()
  categoryNames: string[];

  @Expose()
  @ApiProperty()
  @AutoMap()
  status: string;

  @Expose()
  @ApiProperty()
  @AutoMap()
  thumbnailUrl: string;

  @Expose()
  @ApiProperty()
  @AutoMap()
  imagesUrl: string[];

  @Expose()
  @ApiProperty()
  @AutoMap()
  starRated: number;

  @Expose()
  @ApiProperty()
  @AutoMap()
  stock: number;
}
