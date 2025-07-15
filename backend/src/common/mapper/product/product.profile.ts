import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { GetAllProductResponseDto } from '@product/dto/get-all-product-response.dto';
import { Product } from '@product/entites/products.entity';

@Injectable()
export class ProductProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      this.productToGetAllProductResponse(mapper);
    };
  }

  private productToGetAllProductResponse(mapper: Mapper) {
    createMap(
      mapper,
      Product,
      GetAllProductResponseDto,
      forMember(
        (dest: GetAllProductResponseDto) => dest.brandName,
        mapFrom((src: Product) => src.brand.name),
      ),
      forMember(
        (dest: GetAllProductResponseDto) => dest.stock,
        mapFrom((src: Product) => src.stocking),
      ),
      forMember(
        (dest: GetAllProductResponseDto) => dest.categoryName,
        mapFrom((src: Product) =>
          src.categoriesMapping.map((cm) => cm.category.name),
        ),
      ),
    );
  }
}
