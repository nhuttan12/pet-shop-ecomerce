import { useState, useCallback } from 'react';
import * as cartService from '../../service/products/cartService';
import { CartDetailResponse } from '../../types/Cart';
import { useCartContext } from '../../contexts/CartContext';
import { AxiosError } from 'axios';

export function useCart(token: string) {
  const [carts, setCarts] = useState<CartDetailResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setCartCount } = useCartContext(); // lấy hàm cập nhật cartCount trong Context

  const fetchCartDetails = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const cartsResponse = await cartService.getAllCarts(token, 1, 10);
      const cartsData = cartsResponse.data || [];
      if (cartsData.length === 0) {
        setCarts([]);
        setCartCount(0); // reset số lượng khi không có giỏ hàng
        return;
      }
      const cartId = cartsData[0].id;
      const cartDetailsResponse = await cartService.getCartDetailByCartId(
        token,
        cartId,
        10,
        1
      );
      const cartDetails = cartDetailsResponse.data || [];
      setCarts(cartDetails);
      const totalQuantity = cartDetails.reduce(
        (sum: number, item: CartDetailResponse) => sum + item.quantity,
        0
      );
      setCartCount(totalQuantity); // cập nhật số lượng lên Context
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
    async (id: number) => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        await cartService.removeCart(token, id);
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
