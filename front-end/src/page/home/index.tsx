import React, { useState } from 'react';
import Header from '../../components/layout/header/header';
import Footer from '../../components/layout/footer/footer';
import BestsellersSection from './BestsellersSection';
import banner from '../../assets/banner.jpg';
import { useProducts } from '../../hooks/product/useProducts';

const HomePage: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { products, loading, error } = useProducts(1, 30); // lấy 8 sản phẩm đầu tiên

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleBuyNowClick = () => {
    window.location.href = '/products';
  };


 return (
  <div className="min-h-screen flex flex-col">
    <Header />

    <main className="flex-grow">
      <div className="bg-[#f8f9fa] relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full h-[400px] md:h-[600px]">
              <img
                src={banner}
                alt="banner"
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
              />
            </div>
            <div className="absolute top-1/2 left-15 transform -translate-y-1/2 w-full md:max-w-[600px] text-center md:text-left z-10">
              <span className="text-[#fd7e14] font-bold text-base uppercase">NLU Pet shop</span>
              <h1 className="text-5xl font-bold mt-2 mb-8">Cửa hàng thú cưng có mọi thứ bạn cần</h1>
              <button
                onClick={handleBuyNowClick}
                className="bg-black text-white px-10 py-4 rounded-xl font-semibold text-xl"
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hiển thị loading, error hoặc danh sách sản phẩm */}
      {loading && <div className="text-center py-10 text-xl font-medium">Đang tải sản phẩm...</div>}
      {error && <div className="text-center py-10 text-red-500 font-medium">{error}</div>}
      {!loading && !error && (
        <BestsellersSection
          products={products.map((p) => ({
            ...p,
            image: p.thumbnailUrl || '',
          }))}
        />
      )}
    </main>

    <Footer />

    {/* Phần modal đăng nhập ... */}
    {showLoginModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {/* ... */}
      </div>
    )}
  </div>
);

};

export default HomePage;
