// src/service/cartService.ts
import api from '../api';

export interface CartCreateDTO {
  productID: number;
  quantity: number;
}

export async function addToCart(
  token: string,
  data: CartCreateDTO
) {
  const response = await api.post(
    '/carts/add-to-cart',
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function getAllCarts(
  token: string,
  page?: number,
  limit?: number
) {
  const params: any = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;

  const response = await api.get('/carts', {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return response.data; 
}

export async function getCartById(
  token: string,
  id: number
) {
  const response = await api.get(`/carts/id/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // ApiResponse<Cart>
}

export async function removeCart(
  token: string,
  id: number
) {
  const response = await api.delete(`/carts/cart/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // ApiResponse<Cart>
}

export async function getCartDetailByCartId(
  token: string,
  id: number,
  limit?: number,
  page?: number
) {
  const params: any = { id };
  if (limit) params.limit = limit;
  if (page) params.page = page;

  const response = await api.get('/carts/cart-detail/get', {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return response.data; // ApiResponse<CartDetailResponse[]>
}

export async function removeCartDetail(
  token: string,
  cartDetailId: number
) {
  const response = await api.delete(`/carts/cart-detail/remove/${cartDetailId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // ApiResponse<CartDetail>
}
