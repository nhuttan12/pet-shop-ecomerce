// src/service/cartService.ts
import { AxiosResponse } from 'axios';
import { RemoveCartDetailDTO } from '../../common/dto/cart/remove-cart-detail.dto';
import { ApiResponse } from '../../common/dto/response/api-response.dto';
import api from '../api';
import { PaginationResponse } from '../../common/dto/pagination/pagination-response';
import { CartDetailResponse } from '../../common/dto/cart/cart-detail-response.dto';

export interface CartCreateDTO {
  productID: number;
  quantity: number;
}

export async function addToCart(token: string, data: CartCreateDTO) {
  const response = await api.post('/carts/add-to-cart', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getCartDetailByUserID(
  token: string,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<PaginationResponse<CartDetailResponse>>> {
  const params: Record<string, number> = {};
  if (limit !== undefined) params.limit = limit;
  if (page !== undefined) params.page = page;

  const response: AxiosResponse<
    ApiResponse<PaginationResponse<CartDetailResponse>>
  > = await api.get('/carts/cart-detail', {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  console.log('getCartDetailByUserID', response.data);

  return response.data;
}

export async function removeCartDetail(
  token: string,
  params: RemoveCartDetailDTO
): Promise<ApiResponse<CartDetailResponse>> {
  const response: AxiosResponse<ApiResponse<CartDetailResponse>> =
    await api.delete(`/carts/cart-detail`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
  return response.data;
}
