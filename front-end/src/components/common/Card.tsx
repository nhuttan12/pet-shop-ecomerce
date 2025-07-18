import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CiHeart } from 'react-icons/ci';

interface CardProps {
  id?: number;
  image?: string;
  title?: string;
  price?: string;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: number) => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  id,
  image,
  title,
  price,
  isFavorite = false, // default false
  onFavoriteToggle,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (id) {
      navigate(`/product-detail/${id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`cursor-pointer border border-[#f8f9fa] rounded-[20px] overflow-hidden ${className}`}
    >
      <div className='w-full h-[306px] overflow-hidden'>
        <img src={image} alt={title} className='w-full h-full object-cover' />
      </div>
      <div className='p-5 relative'>
        <h3 className='text-xl font-semibold text-black mb-2'>{title}</h3>
        <p className='text-base text-black'>{price}</p>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onFavoriteToggle && id !== undefined) {
              onFavoriteToggle(id);
            }
          }}
          className='absolute right-5 top-5 bg-[#f8f9fa] w-7 h-7 rounded-full flex items-center justify-center cursor-pointer'
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {/* Thêm style đổi màu đỏ khi isFavorite */}
          <CiHeart
            className={`w-[30px] h-[32px] transition-colors duration-300 ${
              isFavorite ? 'text-red-600' : 'text-gray-400'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default Card;
