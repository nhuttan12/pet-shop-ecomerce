import { WishlistStatus } from '../../enum/wishlist-status.enum';
import { WishlistMappingResponseDto } from './wishlist-mapping-response.dto';

export interface WishlistResponseDto {
  id: number;
  userID: number;
  status: WishlistStatus;
  wishlistMappings: WishlistMappingResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}
