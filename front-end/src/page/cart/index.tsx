import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/header/header';
import Footer from '../../components/layout/footer/footer';
import HeroSection from '../../components/common/HeroSection';
import CartSection from './CartSection';
import CartSummary from './CartSummary';
import { useCart } from '../../hooks/product/useCart';
import { useAuth } from '../../contexts/AuthContext';
import { removeCartDetail } from '../../service/products/cartService';

const CartCheckOut: React.FC = () => {
  const navigate = useNavigate();

  const { token } = useAuth(); // Giả sử AuthContext trả về token
  const { carts, fetchCartDetails } = useCart(token || '');

  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  // Fetch carts khi trang được mở
  useEffect(() => {
    fetchCartDetails();
  }, [fetchCartDetails]);

  // Cập nhật subtotal mỗi khi carts thay đổi
  useEffect(() => {
    const newSubtotal = carts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setSubtotal(newSubtotal);
    setTotal(newSubtotal);
  }, [carts]);

  const handleRemoveItem = async (cartID: number, productID: number) => {
    try {
      if (!token) {
        alert('Người dùng chưa đăng nhập');
        return null;
      }
      await removeCartDetail(token, { cartID, productID });
      await fetchCartDetails();
    } catch (err) {
      console.error('Lỗi xóa sản phẩm', err);
    }
  };

  const handleQuantityChange = async (id: number, quantity: number) => {
    // TODO: Gọi API cập nhật số lượng nếu backend hỗ trợ
    // await updateCartQuantity(token, id, quantity);
    fetchCartDetails();
  };

  const handleUpdateCart = () => {
    fetchCartDetails();
    alert('Giỏ hàng đã được cập nhật!');
  };

  const handleContinueShopping = () => {
    window.location.href = '/products';
  };

  const handleApplyPromoCode = (code: string) => {
    alert(`Mã ưu đãi "${code}" đã được áp dụng!`);
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <HeroSection />
      <main className='flex-grow py-8 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2'>
              <CartSection
                cartItems={carts}
                onRemoveItem={handleRemoveItem}
                onQuantityChange={handleQuantityChange}
                onUpdateCart={handleUpdateCart}
                onContinueShopping={handleContinueShopping}
              />
            </div>
            <div className='lg:col-span-1'>
              <CartSummary
                subtotal={subtotal}
                total={total}
                onApplyPromoCode={handleApplyPromoCode}
                onProceedToCheckout={handleProceedToCheckout}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartCheckOut;
