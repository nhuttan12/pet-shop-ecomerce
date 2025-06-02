import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/header/header';
import Footer from '../../components/layout/footer/footer';
import HeroSection from '../../components/common/HeroSection';
import CartSection from './CartSection';
import CartSummary from './CartSummary';
import { CartItem } from '../../types/Cart';

const CartCheckOut: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Hạt thức ăn Today's dinner cho mèo loại 1kg",
      price: 99000,
      quantity: 1,
      image: "/images/img_ezgif328309e7722jpg.png"
    }
  ]);
  
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  
  // Calculate totals whenever cart items change
  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(newSubtotal);
    setTotal(newSubtotal); // In this example, total equals subtotal (no shipping/tax)
  }, [cartItems]);
  
  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  const handleQuantityChange = (id: number, quantity: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };
  
  const handleUpdateCart = () => {
    // In a real app, this would sync with backend
    alert('Giỏ hàng đã được cập nhật!');
  };
  
  const handleContinueShopping = () => {
    // Navigate to products page
    window.location.href = '/products';
  };
  
  const handleApplyPromoCode = (code: string) => {
    // In a real app, this would validate the promo code with backend
    alert(`Mã ưu đãi "${code}" đã được áp dụng!`);
  };
  
  const handleProceedToCheckout = () => {
    // In a real app, this would navigate to payment page
    alert('Đang chuyển đến trang thanh toán...');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />
      
      <main className="flex-grow py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CartSection 
                cartItems={cartItems}
                onRemoveItem={handleRemoveItem}
                onQuantityChange={handleQuantityChange}
                onUpdateCart={handleUpdateCart}
                onContinueShopping={handleContinueShopping}
              />
            </div>
            
            <div className="lg:col-span-1">
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