import { AutoMap } from '@automapper/classes';
import { WishlistMappingResponseDto } from '@wishlist/dto/wishlist-mapping-response.dto';
import { WishlistStatus } from '@wishlist/enums/wishlist-status.enum';
import { Expose } from 'class-transformer';

export class WishlistResponseDto {
  @Expose()
  @AutoMap()
  id: number;

  @Expose()
  @AutoMap()
  userID: number;

  @Expose()
  @AutoMap()
  status: WishlistStatus;

  @Expose()
  @AutoMap(() => [WishlistMappingResponseDto])
  wishlistMappings: WishlistMappingResponseDto[];

  @Expose()
  @AutoMap()
  createdAt: Date;

  @Expose()
  @AutoMap()
  updatedAt: Date;
}
