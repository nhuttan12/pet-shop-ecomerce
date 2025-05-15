// import React from "react";
//
// type CardProps = {
//     children: React.ReactNode;
//     className?: string;
// };
//
// const Card: React.FC<CardProps> = ({ children, className = "" }) => {
//     return (
//         <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
//             {children}
//         </div>
//     );
// };
//
// export default Card;
import React from 'react';

interface CardProps {
    image: string;
    title: string;
    price: string;
    onAddToWishlist?: () => void;
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
                    <img src="/images/img_vector_15x17.svg" alt="Add to wishlist" className="w-[15px] h-[17px]" />
                </button>
            </div>
        </div>
    );
};

export default Card;