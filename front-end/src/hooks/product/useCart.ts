import { useState, useCallback } from 'react';
import * as cartService from '../../service/products/cartService';
import { useCartContext } from '../../contexts/CartContext';
import { AxiosError } from 'axios';
import { CartDetailResponse } from '../../common/dto/cart/cart-detail-response.dto';
import { PaginationResponse } from '../../common/dto/pagination/pagination-response';
import { ApiResponse } from '../../common/dto/response/api-response.dto';

export function useCart(token: string) {
  const [carts, setCarts] = useState<CartDetailResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setCartCount } = useCartContext();

  const fetchCartDetails = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const cartsResponse: ApiResponse<PaginationResponse<CartDetailResponse>> =
        await cartService.getCartDetailByUserID(token, 1, 10);

      const cartsData = cartsResponse.data?.data || [];

      if (cartsData.length === 0) {
        setCarts([]);
        setCartCount(0); // reset số lượng khi không có giỏ hàng
        return;
      }

      setCarts(cartsData);
      setCartCount(cartsData.length);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || err.message);
        alert(err.response?.data?.message || err.message);
      }
      alert('Lỗi khi lấy giỏ hàng');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, setCartCount]);

  const addToCart = useCallback(
    async (productID: number, quantity: number) => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        await cartService.addToCart(token, { productID, quantity });
        await fetchCartDetails();
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || err.message);
          alert(err.response?.data?.message || err.message);
        }
        alert('Lỗi khi thêm giỏ hàng');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, fetchCartDetails]
  );

  const removeCart = useCallback(
    async (cartID: number, productID: number) => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        await cartService.removeCartDetail(token, { cartID, productID });
        await fetchCartDetails(); // cập nhật số lượng sau khi xóa
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || err.message);
          alert(err.response?.data?.message || err.message);
        }
        alert('Lỗi khi thêm giỏ hàng');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, fetchCartDetails]
  );

  return {
    carts,
    loading,
    error,
    fetchCartDetails,
    addToCart,
    removeCart,
  };
}
