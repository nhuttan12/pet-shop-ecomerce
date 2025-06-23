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
  // Trả về phần "data" chứa data chính (theo kiểu ApiResponse)
  return response.data; 
}

export async function removeFromWishlist(wishlistId: string, token: string) {
  const response = await api.delete('/wishlist/remove', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { wishlistId }, // axios cho phép gửi body trong delete ở data
  });
  return response.data;
}

export async function getWishlistProducts(
  token: string,
  page: number = 1,
  limit: number = 10
) {
  const response = await api.get('/wishlist/products', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit },
  });
  return response.data;
}
