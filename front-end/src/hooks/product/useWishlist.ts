import { useState, useCallback } from 'react';
import {
  addToWishlist,
  removeFromWishlist,
  getWishlistProducts,
} from '../../service/products/wishlistService';
import { WishlistStatus } from '../../enum/wishlist-status.enum';

interface WishlistItem {
  id: number; 
  userId: number;
  productId: number;
  status: WishlistStatus; 
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  price: number;
  thumbnailUrl: string;
}

interface UseWishlistResult {
  wishlistItems: WishlistItem[];
  loading: boolean;
  error: Error | null;
  add: (productId: number) => Promise<WishlistItem | undefined>;
  remove: (wishlistId: number) => Promise<void>;
  fetch: (page?: number, limit?: number) => Promise<void>;
}

export function useWishlist(token: string): UseWishlistResult {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(
    async (page = 1, limit = 1000) => {
      setLoading(true);
      setError(null);
      try {
        const res = await getWishlistProducts(token, page, limit);

        console.log('📥 Raw wishlist data (1st item):', res.data?.[0]);

        const mappedItems = (res.data ?? []).map((item: any) => ({
          ...item,
          productId: item.product?.id, // Nếu product không tồn tại thì vẫn undefined
        }));

        console.log('✅ Wishlist items sau khi mapping:', mappedItems);

        setWishlistItems(mappedItems);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const add = useCallback(
    async (productId: number): Promise<WishlistItem | undefined> => {
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
