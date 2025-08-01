import React from 'react';
import catImage from '../../assets/cat.jpg';
import { PersonalInfo, ShippingAddress } from '../../types/ChechOut';
import { CartDetailResponse } from '../../common/dto/cart/cart-detail-response.dto';

interface OrderSummaryProps {
  personalInfo: PersonalInfo;
  shippingAddress: ShippingAddress;
  discountCode: string;
  paymentMethod: string;
  products: CartDetailResponse[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  onPlaceOrder: () => void;
  loading?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  discountCode,
  products,
  subtotal,
  discount,
  shippingFee,
  onPlaceOrder,
  loading = false,
}) => {
  const total = subtotal - discount + shippingFee;

  return (
    <div className='p-6 bg-gray-100 rounded-lg shadow-md w-full space-y-5'>
      <h2 className='text-xl font-bold'>Tóm tắt đơn hàng</h2>
      {/* Mã giảm giá */}
      {discountCode && (
        <div className='text-sm'>
          <p>
            <strong>Mã giảm giá:</strong> {discountCode}
          </p>
        </div>
      )}

      {/* Sản phẩm */}
      {products.map((product, index) => (
        <div key={index} className='flex items-center space-x-4 border-b pb-4'>
          <img
            src={product.imageUrl || catImage}
            alt={product.productName}
            className='w-16 h-20 object-cover rounded'
          />
          <div className='flex-1'>
            <p className='text-sm font-medium'>{product.productName}</p>
            <p className='text-sm text-gray-600'>
              {product.quantity} x {product.price.toLocaleString()} đ
            </p>
          </div>
        </div>
      ))}

      {/* Tổng kết giá */}
      <div className='space-y-2 text-sm'>
        <div className='flex justify-between'>
          <span>Tạm tính</span>
          <span>{subtotal.toLocaleString()} đ</span>
        </div>
        <div className='flex justify-between'>
          <span>Giảm giá</span>
          <span>-{discount.toLocaleString()} đ</span>
        </div>
        <div className='flex justify-between'>
          <span>Phí vận chuyển</span>
          <span>{shippingFee.toLocaleString()} đ</span>
        </div>
        <div className='border-t pt-2 flex justify-between font-semibold text-base'>
          <span>Tổng cộng</span>
          <span>{total.toLocaleString()} đ</span>
        </div>
      </div>

      <button
        onClick={onPlaceOrder}
        className='w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition'
      >
        {loading ? 'Đang thanh toán...' : 'Thanh toán'}
      </button>
    </div>
  );
};

export default OrderSummary;
