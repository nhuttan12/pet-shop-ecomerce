import { useState, useCallback } from 'react';
import {
  addToWishlist,
  removeFromWishlist,
  getWishlistProducts,
} from '../../service/products/wishlistService';
import { WishlistMappingResponseDto } from '../../common/dto/wishlist/wishlist-response.dto';
import { PaginationResponse } from '../../common/dto/pagination/pagination-response';
import { ApiResponse } from '../../common/dto/response/api-response.dto';

interface UseWishlistResult {
  wishlistItems: WishlistMappingResponseDto[];
  loading: boolean;
  error: Error | null;
  add: (productId: number) => Promise<WishlistMappingResponseDto | undefined>;
  remove: (wishlistId: number) => Promise<void>;
  fetch: (page?: number, limit?: number) => Promise<void>;
}

export function useWishlist(token: string): UseWishlistResult {
  const [wishlistItems, setWishlistItems] = useState<WishlistMappingResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(
    async (page = 1, limit = 1000) => {
      setLoading(true);
      setError(null);
      try {
        const res: ApiResponse<PaginationResponse<WishlistMappingResponseDto>> =
          await getWishlistProducts(token, page, limit);

        console.log('📥 Raw wishlist data (1st item):', res.data);

        setWishlistItems(res.data?.data ?? []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const add = useCallback(
    async (productId: number): Promise<WishlistMappingResponseDto | undefined> => {
      setLoading(true);
      setError(null);
      try {
        const res = await addToWishlist(productId.toString(), token);
        if (res.statusCode === 201) {
          setWishlistItems((prev) => [...prev, res.data]);
          return res.data; // Trả về wishlist item mới tạo
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
      return undefined;
    },
    [token]
  );

  const remove = useCallback(
    async (wishlistId: number): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const res = await removeFromWishlist(wishlistId.toString(), token);
        if (res.statusCode === 200) {
          setWishlistItems((prev) =>
            prev.filter((item) => item.id !== wishlistId)
          );
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { wishlistItems, loading, error, add, remove, fetch };
}
