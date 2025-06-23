// src/service/wishlistService.ts
import api from '../api';

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
  return response.data;
}

export async function removeFromWishlist(wishlistId: string, token: string) {
  const response = await api.delete('/wishlist/remove', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { wishlistId }, // axios delete có thể gửi body trong data
  });
  return response.data;
}
