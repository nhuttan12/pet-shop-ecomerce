import { Product } from '../../../types/Product';
import { GetAllProductResponseDto } from '../../dto/product/get-all-product-response.dto';

export function mapDtoToProduct(dto: GetAllProductResponseDto) {
  return {
    id: dto.id,
    name: dto.name,
    price: dto.price.toFixed(2),
    thumbnailUrl: dto.thumbnailUrl,
    isFavorite: dto.isInWishlist ?? false,
  };
}

export function mapDtoListToProduct(
  dtos: GetAllProductResponseDto[]
): Product[] {
  return dtos.map(mapDtoToProduct);
}
