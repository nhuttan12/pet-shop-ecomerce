import React from 'react';
import { CiHeart } from "react-icons/ci";

interface CardProps {
    id?: number;
    image?: string;
    title?: string;
    price?: string;
    onAddToWishlist?: () => void;
    isFavorite?: boolean;
    onFavoriteToggle?: (id: number) => void;
    className?: string;
}

const Card: React.FC<CardProps> = ({
                                       image,
                                       title,
                                       price,
                                       onAddToWishlist = () => {},
                                       className = '',
                                   }) => {
    return (
        <div className={`border border-[#f8f9fa] rounded-[20px] overflow-hidden ${className}`}>
            <div className="w-full h-[306px] overflow-hidden">
                <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="p-5 relative">
                <h3 className="text-xl font-semibold text-black mb-2">{title}</h3>
                <p className="text-base text-black">{price}</p>
                <button
                    onClick={onAddToWishlist}
                    className="absolute right-5 top-5 bg-[#f8f9fa] w-7 h-7 rounded-full flex items-center justify-center"
                >
                    <CiHeart className="w-[30px] h-[32px]" />
                </button>
            </div>
        </div>
    );
};

export default Card;