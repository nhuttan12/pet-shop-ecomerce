import { useState, useCallback } from 'react';
import {
  addToWishlist,
  removeFromWishlist,
  getWishlistProducts,
} from '../../service/products/wishlistService';

interface WishlistItem {
  id: number;         // id của wishlist record
  userId: number;
  productId: number;
  status: any;        // null hoặc gì đó
  created_at: string;
  updated_at: string;
  // Nếu cần có thêm thông tin product, có thể fetch riêng
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
    async (page = 1, limit = 10) => {
      setLoading(true);
      setError(null);
      try {
        const res = await getWishlistProducts(token, page, limit);
        setWishlistItems(res.data ?? []);
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
          setWishlistItems(prev => [...prev, res.data]);
          return res.data;  // Trả về wishlist item mới tạo
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
          setWishlistItems(prev =>
            prev.filter(item => item.id !== wishlistId)
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

