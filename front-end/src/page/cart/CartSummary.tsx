import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import InputField from '../../components/ui/InputField';

interface CartSummaryProps {
  subtotal: number;
  total: number;
  onApplyPromoCode: (code: string) => void;
  onProceedToCheckout: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  total,
  onApplyPromoCode,
  onProceedToCheckout
}) => {
  const [promoCode, setPromoCode] = useState('');

  const handleApplyPromoCode = () => {
    if (promoCode.trim()) {
      onApplyPromoCode(promoCode);
    }
  };

  return (
    <div className="border border-[#a48c8ca8]">
      <div className="border-b border-[#a48c8ca8] p-4">
        <h2 className="text-xl font-bold uppercase">Cộng giỏ hàng</h2>
      </div>
      
      <div className="border-b border-[#a48c8ca8] p-4 flex justify-between items-center">
        <span className="text-xl">Tạm tính</span>
        <span className="text-xl font-bold">{subtotal.toLocaleString()} ₫</span>
      </div>
      
      <div className="border-b border-[#a48c8ca8] p-4 flex justify-between items-center">
        <span className="text-xl">Tổng</span>
        <span className="text-xl font-bold">{total.toLocaleString()} ₫</span>
      </div>
      
      <div className="p-4">
        <Button 
          variant="primary" 
          onClick={onProceedToCheckout}
          fullWidth
          className="uppercase py-3 text-xl"
        >
          Tiến hành thanh toán
        </Button>
        
        <div className="mt-6">
          <div className="flex items-center mb-2">
            <img src="/images/img_vector_gray_600.svg" alt="Promo" className="w-[18px] h-[18px] mr-2" />
            <h3 className="text-lg font-bold text-[#757575]">Mã ưu đãi</h3>
          </div>
          
          <InputField
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Mã ưu đãi"
            className="border border-[#dddddd] shadow-sm py-3"
          />
          
          <button 
            onClick={handleApplyPromoCode}
            className="w-full mt-4 py-2 bg-[#f9f9f9] border border-[#dddddd] text-[#666666] text-xl hover:bg-[#f0f0f0] transition-colors"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;