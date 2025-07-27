import React from 'react';
import InputField from '../../components/ui/InputField';
import { PaymentMethod } from '../../common/enum/order/payment-method.enum';
interface PaymentMethodFormProps {
  paymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
  onApplyDiscountCode: () => void;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
  paymentMethod,
  onPaymentMethodChange,
}) => {
  return (
    <div className='mb-6'>
      <div className='p-6 border border-gray-300 rounded-lg bg-white shadow-sm space-y-4'>
        <h2 className='text-2xl font-bold'>Phương thức thanh toán</h2>

        {/* ✅ Chỉnh sửa ở đây */}
        <div className='flex flex-row items-center space-x-6'>
          <label className='flex items-center space-x-2'>
            <input
              type='radio'
              name='paymentMethod'
              value='cash'
              checked={paymentMethod === 'cash'}
              onChange={() => onPaymentMethodChange('cash')}
              className='accent-orange-500'
            />
            <span>Thanh toán khi nhận hàng</span>
          </label>

          <label className='flex items-center space-x-2'>
            <input
              type='radio'
              name='paymentMethod'
              value='creditCard'
              checked={paymentMethod === PaymentMethod.CREDIT_CARD}
              onChange={() => onPaymentMethodChange('creditCard')}
              className='accent-orange-500'
            />
            <span>Thẻ tín dụng / thẻ ghi nợ</span>
          </label>

          <label className='flex items-center space-x-2'>
            <input
              type='radio'
              name='paymentMethod'
              value='paypal'
              checked={paymentMethod === 'paypal'}
              onChange={() => onPaymentMethodChange('paypal')}
              className='accent-orange-500'
            />
            <span>PayPal</span>
          </label>
        </div>

        {paymentMethod === PaymentMethod.CREDIT_CARD && (
          <div className='space-y-4 mt-4'>
            <InputField label='Tên chủ thẻ' placeholder='Nguyễn Văn A' />
            <InputField label='Số thẻ' placeholder='1234 5678 9012 3456' />
            <div className='grid grid-cols-2 gap-4'>
              <InputField label='Ngày hết hạn' placeholder='MM/YY' />
              <InputField label='Mã CVC' placeholder='123' />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodForm;
