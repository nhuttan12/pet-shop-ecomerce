import { AxiosResponse } from 'axios';
import { PaginationResponse } from '../../common/dto/pagination/pagination-response';
import { ApiResponse } from '../../common/dto/response/api-response.dto';
import { WishlistMappingResponseDto } from '../../common/dto/wishlist/wishlist-mapping-response.dto';
import api from '../api';
import { WishlistResponseDto } from '../../common/dto/wishlist/wishlist-response.dto';

export async function addToWishlist(productId: string, token: string) {
  const response = await api.post(
    '/wishlist/create',
    { productId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  // Trả về phần "data" chứa data chính (theo kiểu ApiResponse)
  return response.data;
}

export async function removeFromWishlist(
  wishlistId: string,
  token: string
): Promise<AxiosResponse<ApiResponse<WishlistResponseDto>>> {
  const response = await api.delete('/wishlist/remove', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { wishlistId },
  });
  return response.data;
}

export async function getWishlistProducts(
  token: string,
  page: number = 1,
  limit: number = 10
): Promise<
  AxiosResponse<ApiResponse<PaginationResponse<WishlistMappingResponseDto>>>
> {
  const response = await api.get('/wishlist/products', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit },
  });
  return response.data;
}
