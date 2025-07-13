import React from 'react';
import FavoriteList from './index';

const FavoriteProductsPage: React.FC = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return (
      <div className="text-center mt-6">
        Vui lòng đăng nhập để xem danh sách yêu thích.
      </div>
    );
  }

  return <FavoriteList token={token} />;
};

export default FavoriteProductsPage;
