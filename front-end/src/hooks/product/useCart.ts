import { useState, useCallback } from 'react';
import * as cartService from '../../service/products/cartService';
import { CartDetailResponse } from '../../types/Cart';
import { useCartContext } from '../../contexts/CartContext';

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
      const cartDetailsResponse = await cartService.getCartDetailByCartId(token, cartId);
      const cartDetails = cartDetailsResponse.data || [];
      setCarts(cartDetails);
      const totalQuantity = cartDetails.reduce((sum: number, item:CartDetailResponse) => sum + item.quantity, 0);
      setCartCount(totalQuantity); // cập nhật số lượng lên Context
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Lỗi khi lấy giỏ hàng');
    } finally {
      setLoading(false);
    }
  }, [token, setCartCount]);

  const addToCart = useCallback(async (productId: number, quantity: number) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      await cartService.addToCart(token, { productId, quantity });
      await fetchCartDetails(); // fetch lại giỏ hàng, update số lượng luôn ở fetchCartDetails
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Lỗi khi thêm giỏ hàng');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, fetchCartDetails]);

  const removeCart = useCallback(async (id: number) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      await cartService.removeCart(token, id);
      await fetchCartDetails(); // cập nhật số lượng sau khi xóa
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Lỗi khi xoá sản phẩm');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, fetchCartDetails]);

  return {
    carts,
    loading,
    error,
    fetchCartDetails,
    addToCart,
    removeCart,
  };
}
