// pages/cart/CartPage.tsx
import React from 'react';
// import HeroSection from '../../components/common/HeroSection';
import MyOrders from './MyOrders';
import Header from '../../components/layout/header/header';
import Footer from '../../components/layout/footer/footer';
// import Cart from '@/components/common/Cart';

const Order:  React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-1">
        <MyOrders />
      </main>
      <Footer />
    </div>
  );
};

export default Order;
