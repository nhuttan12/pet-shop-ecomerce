import { useState } from 'react';
import { addToWishlist, removeFromWishlist } from '../../service/products/wishlistService';

export function useWishlist(token: string) {
  // Khai báo error có thể là Error hoặc null
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const add = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await addToWishlist(productId, token);
      setLoading(false);
      return res;
    } catch (e: unknown) {
      // Bây giờ e có kiểu unknown, bạn phải xử lý convert sang Error
      if (e instanceof Error) {
        setError(e);
      } else {
        // Nếu không phải Error, bạn có thể tạo 1 Error mới hoặc để null
        setError(new Error('Unknown error'));
      }
      setLoading(false);
      throw e;
    }
  };

  const remove = async (wishlistId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await removeFromWishlist(wishlistId, token);
      setLoading(false);
      return res;
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e);
      } else {
        setError(new Error('Unknown error'));
      }
      setLoading(false);
      throw e;
    }
  };

  return { add, remove, loading, error };
}
