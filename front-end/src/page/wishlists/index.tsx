import React, { useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import Footer from '../../components/layout/footer/footer';
import Header from '../../components/layout/header/header';
// import { useCartContext } from "../../contexts/CartContext";
import { WishlistMappingResponseDto } from '../../common/dto/wishlist/wishlist-mapping-response.dto';
import { useWishlist } from '../../hooks//product/useWishlist'; // ✅ dùng useWishlist
import { useCart } from '../../hooks/product/useCart';

interface Props {
  token: string; // ✅ truyền token
}

const FavoriteList: React.FC<Props> = ({ token }) => {
  const { addToCart } = useCart(token);
  const { wishlistItems, loading, fetch, remove } = useWishlist(token);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <>
      <Header />
      <main className='min-h-[90vh] px-4 py-6 flex justify-center'>
        <div className='w-full max-w-[1440px] px-6 py-6 shadow-md rounded-[40px] bg-white'>
          <h2 className='text-2xl font-bold mb-4 text-center'>
            Danh sách yêu thích
          </h2>

          {loading ? (
            <div className='text-center mt-6'>
              Đang tải danh sách yêu thích...
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className='text-center mt-6 text-gray-500'>
              Bạn chưa có sản phẩm nào trong danh sách yêu thích.
            </div>
          ) : (
            <div className='flex flex-col space-y-6'>
              {wishlistItems.map((item: WishlistMappingResponseDto) => (
                <div
                  key={item.id}
                  className='w-full flex flex-col sm:flex-row items-center gap-4 p-4 bg-white border border-gray-100 shadow hover:shadow-md rounded-xl transition duration-200'
                >
                  <img
                    src={item.thumbnailUrl || '/no-image.jpg'}
                    alt={item.productName}
                    className='w-32 h-32 object-cover rounded-md'
                  />

                  <div className='flex flex-col flex-grow gap-2'>
                    <h3 className='font-semibold text-lg'>
                      {item.productName}
                    </h3>
                    <p className='text-red-600 font-bold text-base'>
                      {item.productPrice.toLocaleString('vi-VN')}₫
                    </p>

                    <div className='flex gap-3 mt-2'>
                      <button
                        onClick={() => addToCart(item.productID, 1)}
                        className='flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm'
                      >
                        <FiShoppingCart className='mr-1' />
                        Thêm vào giỏ
                      </button>

                      <button
                        onClick={() => remove(item.id)}
                        className='text-red-500 text-xl hover:scale-110 transition'
                        title='Xóa khỏi yêu thích'
                      >
                        <FaHeart />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FavoriteList;
